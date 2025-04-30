import { BadRequestException, Injectable } from '@nestjs/common'
import { OrderRepository } from './order.repository'
import {
	OrderCreateOneRequest,
	OrderCreateOneWithPaymentProductRequest,
	OrderDeleteOneRequest,
	OrderFindManyRequest,
	OrderFindOneRequest,
	OrderGetManyRequest,
	OrderGetOneRequest,
	OrderUpdateOneRequest,
} from './interfaces'
import { createResponse, CRequest, DeleteMethodEnum } from '../../common'
import { PartnerService } from '../partner'
import { ClientPurchaseStatus, PartnerRoleEnum } from '@prisma/client'
import { PaymentService } from '../payment'
import { OrderProductService } from '../order-product'
import { GoogleSheetService } from '../shared'
import { CartService } from '../cart'

@Injectable()
export class OrderService {
	private readonly orderRepository: OrderRepository
	private readonly partnerService: PartnerService
	private readonly paymentService: PaymentService
	private readonly orderProductService: OrderProductService
	private readonly cartService: CartService
	private readonly googleSheetService: GoogleSheetService
	constructor(
		orderRepository: OrderRepository,
		partnerService: PartnerService,
		paymentService: PaymentService,
		orderProductService: OrderProductService,
		googleSheetService: GoogleSheetService,
		cartService: CartService,
	) {
		this.orderRepository = orderRepository
		this.partnerService = partnerService
		this.paymentService = paymentService
		this.orderProductService = orderProductService
		this.googleSheetService = googleSheetService
		this.cartService = cartService
	}

	async findMany(query: OrderFindManyRequest) {
		const orders = await this.orderRepository.findMany(query)
		const ordersCount = await this.orderRepository.countFindMany(query)

		const result = query.pagination
			? {
					totalCount: ordersCount,
					pagesCount: Math.ceil(ordersCount / query.pageSize),
					pageSize: orders.length,
					data: orders,
				}
			: { data: orders }

		return createResponse({ data: result, success: { messages: ['find many success'] } })
	}

	async findOne(query: OrderFindOneRequest) {
		const staff = await this.orderRepository.findOne(query)

		if (!staff) {
			throw new BadRequestException('furniture type not found')
		}
		return createResponse({ data: { ...staff }, success: { messages: ['find one success'] } })
	}

	async getMany(query: OrderGetManyRequest) {
		const orders = await this.orderRepository.getMany(query)
		const ordersCount = await this.orderRepository.countGetMany(query)

		const result = query.pagination
			? {
					pagesCount: Math.ceil(ordersCount / query.pageSize),
					pageSize: orders.length,
					data: orders,
				}
			: { data: orders }

		return createResponse({ data: result, success: { messages: ['get many success'] } })
	}

	async getOne(query: OrderGetOneRequest) {
		const staff = await this.orderRepository.getOne(query)

		if (!staff) {
			throw new BadRequestException('furniture type not found')
		}

		return createResponse({ data: staff, success: { messages: ['get one success'] } })
	}

	async createOne(body: OrderCreateOneRequest) {
		const client = await this.partnerService.getOne({ id: body.clientId })
		const clientRole = client.data.roles.find((r) => r.name === PartnerRoleEnum.client)
		if (!clientRole) {
			throw new BadRequestException('client not found')
		}

		await this.orderRepository.createOne({ ...body, purchaseStatus: client.data.orders.length ? ClientPurchaseStatus.next : ClientPurchaseStatus.first })

		return createResponse({ data: null, success: { messages: ['create one success'] } })
	}

	async createOneWithPaymentProduct(request: CRequest, body: OrderCreateOneWithPaymentProductRequest) {
		const client = await this.partnerService.getOne({ id: body.clientId })
		const clientRole = client.data.roles.find((r) => r.name === PartnerRoleEnum.client)
		if (!clientRole) {
			throw new BadRequestException('client not found')
		}
		const order = await this.orderRepository.createOne({
			...body,
			staffId: request.user.id,
			purchaseStatus: client.data.orders.length ? ClientPurchaseStatus.next : ClientPurchaseStatus.first,
		})

		const orderProducts = await this.orderProductService.createMany(body.products.map((p) => ({ id: undefined, ...p, orderId: order.id })))
		const payments = await this.paymentService.createMany(body.payments.map((p) => ({ ...p, orderId: order.id })))

		const staffCarts = await this.cartService.getMany({ staffId: request.user.id, pagination: false })
		await this.cartService.deleteMany(staffCarts.data.data)

		await this.googleSheetService.addOrderToSheet(order, orderProducts.data, payments.data)

		return createResponse({ data: null, success: { messages: ['create one success'] } })
	}

	async updateOne(query: OrderGetOneRequest, body: OrderUpdateOneRequest) {
		await this.getOne(query)

		if (body.clientId) {
			const client = await this.partnerService.getOne({ id: body.clientId })
			const clientRole = client.data.roles.find((r) => r.name === PartnerRoleEnum.client)
			if (!clientRole) {
				throw new BadRequestException('client not found')
			}
		}

		await this.orderRepository.updateOne(query, { ...body })

		return createResponse({ data: null, success: { messages: ['update one success'] } })
	}

	async deleteOne(query: OrderDeleteOneRequest) {
		await this.getOne(query)
		if (query.method === DeleteMethodEnum.hard) {
			await this.orderRepository.deleteOne(query)
		} else {
			await this.orderRepository.updateOne(query, { deletedAt: new Date() })
		}
		return createResponse({ data: null, success: { messages: ['delete one success'] } })
	}
}
