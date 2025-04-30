import { BadRequestException, Injectable } from '@nestjs/common'
import { OrderProductRepository } from './order-product.repository'
import {
	OrderProductCreateOneRequest,
	OrderProductDeleteOneRequest,
	OrderProductFindManyRequest,
	OrderProductFindOneRequest,
	OrderProductGetManyRequest,
	OrderProductGetOneRequest,
	OrderProductUpdateOneRequest,
} from './interfaces'
import { createResponse, DeleteMethodEnum } from '../../common'

@Injectable()
export class OrderProductService {
	private readonly orderProductRepository: OrderProductRepository
	constructor(orderProductRepository: OrderProductRepository) {
		this.orderProductRepository = orderProductRepository
	}

	async findMany(query: OrderProductFindManyRequest) {
		const orderProducts = await this.orderProductRepository.findMany(query)
		const orderProductsCount = await this.orderProductRepository.countFindMany(query)

		const result = query.pagination
			? {
					totalCount: orderProductsCount,
					pagesCount: Math.ceil(orderProductsCount / query.pageSize),
					pageSize: orderProducts.length,
					data: orderProducts,
				}
			: { data: orderProducts }

		return createResponse({ data: result, success: { messages: ['find many success'] } })
	}

	async findOne(query: OrderProductFindOneRequest) {
		const orderProduct = await this.orderProductRepository.findOne(query)

		if (!orderProduct) {
			throw new BadRequestException('order product not found')
		}
		return createResponse({ data: { ...orderProduct }, success: { messages: ['find one success'] } })
	}

	async getMany(query: OrderProductGetManyRequest) {
		const orderProducts = await this.orderProductRepository.getMany(query)
		const orderProductsCount = await this.orderProductRepository.countGetMany(query)

		const result = query.pagination
			? {
					pagesCount: Math.ceil(orderProductsCount / query.pageSize),
					pageSize: orderProducts.length,
					data: orderProducts,
				}
			: { data: orderProducts }

		return createResponse({ data: result, success: { messages: ['get many success'] } })
	}

	async getOne(query: OrderProductGetOneRequest) {
		const orderProduct = await this.orderProductRepository.getOne(query)

		if (!orderProduct) {
			throw new BadRequestException('order product not found')
		}

		return createResponse({ data: orderProduct, success: { messages: ['get one success'] } })
	}

	async createOne(body: OrderProductCreateOneRequest) {
		await this.orderProductRepository.createOne({ ...body })

		return createResponse({ data: null, success: { messages: ['create one success'] } })
	}

	async createMany(body: OrderProductCreateOneRequest[]) {
		const orderProducts = await this.orderProductRepository.createMany(body)

		return createResponse({ data: null, success: { messages: ['create many success'] } })
	}

	async updateOne(query: OrderProductGetOneRequest, body: OrderProductUpdateOneRequest) {
		await this.getOne(query)

		await this.orderProductRepository.updateOne(query, { ...body })

		return createResponse({ data: null, success: { messages: ['update one success'] } })
	}

	async deleteOne(query: OrderProductDeleteOneRequest) {
		await this.getOne(query)
		if (query.method === DeleteMethodEnum.hard) {
			await this.orderProductRepository.deleteOne(query)
		} else {
			await this.orderProductRepository.updateOne(query, { deletedAt: new Date() })
		}
		return createResponse({ data: null, success: { messages: ['delete one success'] } })
	}
}
