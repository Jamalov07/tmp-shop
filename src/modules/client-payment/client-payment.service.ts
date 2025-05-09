import { BadRequestException, Injectable } from '@nestjs/common'
import { ClientPaymentRepository } from './client-payment.repository'
import { createResponse } from '@common'
import {
	ClientPaymentGetOneRequest,
	ClientPaymentCreateOneRequest,
	ClientPaymentUpdateOneRequest,
	ClientPaymentGetManyRequest,
	ClientPaymentFindManyRequest,
	ClientPaymentFindOneRequest,
} from './interfaces'

@Injectable()
export class ClientPaymentService {
	private readonly clientPaymentRepository: ClientPaymentRepository

	constructor(clientPaymentRepository: ClientPaymentRepository) {
		this.clientPaymentRepository = clientPaymentRepository
	}

	async findMany(query: ClientPaymentFindManyRequest) {
		const clientPayments = await this.clientPaymentRepository.findMany(query)
		const clientPaymentsCount = await this.clientPaymentRepository.countFindMany(query)

		const result = query.pagination
			? {
					totalCount: clientPaymentsCount,
					pagesCount: Math.ceil(clientPaymentsCount / query.pageSize),
					pageSize: clientPayments.length,
					data: clientPayments,
				}
			: { data: clientPayments }

		return createResponse({ data: result, success: { messages: ['find many success'] } })
	}

	async findOne(query: ClientPaymentFindOneRequest) {
		const clientPayment = await this.clientPaymentRepository.findOne(query)

		if (!clientPayment) {
			throw new BadRequestException('clientPayment not found')
		}

		return createResponse({ data: clientPayment, success: { messages: ['find one success'] } })
	}

	async getMany(query: ClientPaymentGetManyRequest) {
		const clientPayments = await this.clientPaymentRepository.getMany(query)
		const clientPaymentsCount = await this.clientPaymentRepository.countGetMany(query)

		const result = query.pagination
			? {
					pagesCount: Math.ceil(clientPaymentsCount / query.pageSize),
					pageSize: clientPayments.length,
					data: clientPayments,
				}
			: { data: clientPayments }

		return createResponse({ data: result, success: { messages: ['get many success'] } })
	}

	async getOne(query: ClientPaymentGetOneRequest) {
		const clientPayment = await this.clientPaymentRepository.getOne(query)

		if (!clientPayment) {
			throw new BadRequestException('clientPayment not found')
		}

		return createResponse({ data: clientPayment, success: { messages: ['get one success'] } })
	}

	async createOne(body: ClientPaymentCreateOneRequest) {
		const clientPayment = await this.clientPaymentRepository.createOne({ ...body })

		return createResponse({ data: clientPayment, success: { messages: ['create success'] } })
	}

	async updateOne(query: ClientPaymentGetOneRequest, body: ClientPaymentUpdateOneRequest) {
		await this.getOne(query)

		await this.clientPaymentRepository.updateOne(query, { ...body })

		return createResponse({ data: null, success: { messages: ['update success'] } })
	}

	async deleteOne(query: ClientPaymentGetOneRequest) {
		await this.getOne(query)

		await this.clientPaymentRepository.deleteOne(query)

		return createResponse({ data: null, success: { messages: ['delete success'] } })
	}
}
