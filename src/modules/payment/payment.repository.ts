import { Injectable } from '@nestjs/common'
import { PrismaService } from '../shared'
import {
	PaymentCreateOneRequest,
	PaymentDeleteOneRequest,
	PaymentFindManyRequest,
	PaymentFindOneRequest,
	PaymentGetManyRequest,
	PaymentGetOneRequest,
	PaymentUpdateOneRequest,
} from './interfaces'
import { deletedAtConverter } from '../../common'
import { PaymentController } from './payment.controller'

@Injectable()
export class PaymentRepository {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async findMany(query: PaymentFindManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const payments = await this.prisma.paymentModel.findMany({
			where: {
				deletedAt: deletedAtConverter(query.isDeleted),
				description: { contains: query.description, mode: 'insensitive' },
			},
			...paginationOptions,
		})

		return payments
	}

	async findOne(query: PaymentFindOneRequest) {
		const staff = await this.prisma.paymentModel.findFirst({
			where: {
				id: query.id,
			},
		})

		return staff
	}

	async countFindMany(query: PaymentFindManyRequest) {
		const paymentCount = await this.prisma.paymentModel.count({
			where: {
				deletedAt: deletedAtConverter(query.isDeleted),
				description: { contains: query.description, mode: 'insensitive' },
			},
		})

		return paymentCount
	}

	async getMany(query: PaymentGetManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const payments = await this.prisma.paymentModel.findMany({
			where: {
				id: { in: query.ids },
				deletedAt: deletedAtConverter(query.isDeleted),
				description: query.description,
			},
			...paginationOptions,
		})

		return payments
	}

	async getOne(query: PaymentGetOneRequest) {
		const staff = await this.prisma.paymentModel.findFirst({
			where: {
				id: query.id,
				description: query.description,
			},
		})

		return staff
	}

	async countGetMany(query: PaymentGetManyRequest) {
		const paymentCount = await this.prisma.paymentModel.count({
			where: {
				id: { in: query.ids },
				deletedAt: deletedAtConverter(query.isDeleted),
				description: query.description,
			},
		})

		return paymentCount
	}

	async createOne(body: PaymentCreateOneRequest) {
		const payment = await this.prisma.paymentModel.create({
			data: {
				description: body.description,
				exchangeRate: body.exchangeRate,
				fromCurrency: body.fromCurrency,
				method: body.method,
				orderId: body.orderId,
				sum: body.sum,
				totalSum: body.totalSum,
			},
		})
		return payment
	}

	async createMany(body: PaymentCreateOneRequest[]) {
		const payments = await this.prisma.paymentModel.createManyAndReturn({
			data: body.map((p) => {
				return {
					description: p.description,
					exchangeRate: p.exchangeRate,
					fromCurrency: p.fromCurrency,
					method: p.method,
					orderId: p.orderId,
					sum: p.sum,
					totalSum: p.totalSum,
				}
			}),
			select: { id: true, createdAt: true, exchangeRate: true, deletedAt: true, fromCurrency: true, toCurrency: true, description: true, method: true, sum: true, totalSum: true },
		})
		return payments
	}

	async updateOne(query: PaymentGetOneRequest, body: PaymentUpdateOneRequest) {
		const payment = await this.prisma.paymentModel.update({
			where: { id: query.id },
			data: {
				description: body.description,
				exchangeRate: body.exchangeRate,
				fromCurrency: body.fromCurrency,
				method: body.method,
				orderId: body.orderId,
				sum: body.sum,
				totalSum: body.totalSum,
			},
		})

		return payment
	}

	async deleteOne(query: PaymentDeleteOneRequest) {
		const payment = await this.prisma.paymentModel.delete({
			where: { id: query.id },
		})
		return payment
	}

	async onModuleInit() {
		await this.prisma.createActionMethods(PaymentController)
	}
}
