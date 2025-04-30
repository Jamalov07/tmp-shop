import { BadRequestException, Injectable } from '@nestjs/common'
import { PaymentRepository } from './payment.repository'
import {
	PaymentCreateOneRequest,
	PaymentDeleteOneRequest,
	PaymentFindManyRequest,
	PaymentFindOneRequest,
	PaymentGetManyRequest,
	PaymentGetOneRequest,
	PaymentUpdateOneRequest,
} from './interfaces'
import { createResponse, DeleteMethodEnum } from '../../common'

@Injectable()
export class PaymentService {
	private readonly paymentRepository: PaymentRepository
	constructor(paymentRepository: PaymentRepository) {
		this.paymentRepository = paymentRepository
	}

	async findMany(query: PaymentFindManyRequest) {
		const payments = await this.paymentRepository.findMany(query)
		const paymentsCount = await this.paymentRepository.countFindMany(query)

		const result = query.pagination
			? {
					totalCount: paymentsCount,
					pagesCount: Math.ceil(paymentsCount / query.pageSize),
					pageSize: payments.length,
					data: payments,
				}
			: { data: payments }

		return createResponse({ data: result, success: { messages: ['find many success'] } })
	}

	async findOne(query: PaymentFindOneRequest) {
		const staff = await this.paymentRepository.findOne(query)

		if (!staff) {
			throw new BadRequestException('furniture type not found')
		}
		return createResponse({ data: { ...staff }, success: { messages: ['find one success'] } })
	}

	async getMany(query: PaymentGetManyRequest) {
		const payments = await this.paymentRepository.getMany(query)
		const paymentsCount = await this.paymentRepository.countGetMany(query)

		const result = query.pagination
			? {
					pagesCount: Math.ceil(paymentsCount / query.pageSize),
					pageSize: payments.length,
					data: payments,
				}
			: { data: payments }

		return createResponse({ data: result, success: { messages: ['get many success'] } })
	}

	async getOne(query: PaymentGetOneRequest) {
		const staff = await this.paymentRepository.getOne(query)

		if (!staff) {
			throw new BadRequestException('furniture type not found')
		}

		return createResponse({ data: staff, success: { messages: ['get one success'] } })
	}

	async createOne(body: PaymentCreateOneRequest) {
		await this.paymentRepository.createOne({ ...body })

		return createResponse({ data: null, success: { messages: ['create one success'] } })
	}

	async createMany(body: PaymentCreateOneRequest[]) {
		const payments = await this.paymentRepository.createMany(body)

		return createResponse({ data: payments, success: { messages: ['create many success'] } })
	}

	async updateOne(query: PaymentGetOneRequest, body: PaymentUpdateOneRequest) {
		await this.getOne(query)

		await this.paymentRepository.updateOne(query, { ...body })

		return createResponse({ data: null, success: { messages: ['update one success'] } })
	}

	async deleteOne(query: PaymentDeleteOneRequest) {
		await this.getOne({ id: query.id })
		if (query.method === DeleteMethodEnum.hard) {
			await this.paymentRepository.deleteOne(query)
		} else {
			await this.paymentRepository.updateOne({ id: query.id }, { deletedAt: new Date() })
		}
		return createResponse({ data: null, success: { messages: ['delete one success'] } })
	}
}
