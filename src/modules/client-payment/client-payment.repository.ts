import { Injectable } from '@nestjs/common'
import { PrismaService } from '../shared'
import {
	ClientPaymentCreateOneRequest,
	ClientPaymentDeleteOneRequest,
	ClientPaymentFindManyRequest,
	ClientPaymentFindOneRequest,
	ClientPaymentGetManyRequest,
	ClientPaymentGetOneRequest,
	ClientPaymentUpdateOneRequest,
} from './interfaces'
import { ClientPaymentController } from './client-payment.controller'

@Injectable()
export class ClientPaymentRepository {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async findMany(query: ClientPaymentFindManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const clientPayments = await this.prisma.clientPaymentModel.findMany({
			where: {
				description: { contains: query.description, mode: 'insensitive' },
				clientId: query.clientId,
			},
			...paginationOptions,
		})

		return clientPayments
	}

	async findOne(query: ClientPaymentFindOneRequest) {
		const clientPayment = await this.prisma.clientPaymentModel.findFirst({
			where: { id: query.id },
		})

		return clientPayment
	}

	async countFindMany(query: ClientPaymentFindManyRequest) {
		const clientPaymentsCount = await this.prisma.clientPaymentModel.count({
			where: {
				description: { contains: query.description, mode: 'insensitive' },
				clientId: query.clientId,
			},
		})

		return clientPaymentsCount
	}

	async getMany(query: ClientPaymentGetManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const clientPayments = await this.prisma.clientPaymentModel.findMany({
			where: { id: { in: query.ids }, description: query.description, clientId: query.clientId },
			...paginationOptions,
		})

		return clientPayments
	}

	async getOne(query: ClientPaymentGetOneRequest) {
		const clientPayment = await this.prisma.clientPaymentModel.findFirst({
			where: { id: query.id },
		})

		return clientPayment
	}

	async countGetMany(query: ClientPaymentGetManyRequest) {
		const clientPaymentsCount = await this.prisma.clientPaymentModel.count({
			where: { id: { in: query.ids }, description: query.description, clientId: query.clientId },
		})

		return clientPaymentsCount
	}

	async createOne(body: ClientPaymentCreateOneRequest) {
		const clientPayment = await this.prisma.clientPaymentModel.create({
			data: {
				description: body.description,
				clientId: body.clientId,
				card: body.card,
				cash: body.cash,
				other: body.other,
				transfer: body.transfer,
			},
		})
		return clientPayment
	}

	async updateOne(query: ClientPaymentGetOneRequest, body: ClientPaymentUpdateOneRequest) {
		const clientPayment = await this.prisma.clientPaymentModel.update({
			where: { id: query.id },
			data: {
				description: body.description,
				clientId: body.clientId,
				card: body.card,
				cash: body.cash,
				other: body.other,
				transfer: body.transfer,
			},
		})

		return clientPayment
	}

	async deleteOne(query: ClientPaymentDeleteOneRequest) {
		const clientPayment = await this.prisma.clientPaymentModel.delete({
			where: { id: query.id },
		})

		return clientPayment
	}

	async onModuleInit() {
		await this.prisma.createActionMethods(ClientPaymentController)
	}
}
