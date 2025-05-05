import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaService } from '../shared/prisma'
import {
	StaffPaymentCreateOneRequest,
	StaffPaymentDeleteOneRequest,
	StaffPaymentFindManyRequest,
	StaffPaymentFindOneRequest,
	StaffPaymentGetManyRequest,
	StaffPaymentGetOneRequest,
	StaffPaymentUpdateOneRequest,
} from './interfaces'
import { StaffPaymentController } from './staff-payment.controller'

@Injectable()
export class StaffPaymentRepository implements OnModuleInit {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async findMany(query: StaffPaymentFindManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const staffPayments = await this.prisma.staffPaymentModel.findMany({
			where: {
				staffId: query.staffId,
				description: { contains: query.description, mode: 'insensitive' },
			},
			...paginationOptions,
		})

		return staffPayments
	}

	async findOne(query: StaffPaymentFindOneRequest) {
		const staffPayment = await this.prisma.staffPaymentModel.findFirst({
			where: { id: query.id },
		})

		return staffPayment
	}

	async countFindMany(query: StaffPaymentFindManyRequest) {
		const staffPaymentsCount = await this.prisma.staffPaymentModel.count({
			where: {
				staffId: query.staffId,
				description: { contains: query.description, mode: 'insensitive' },
			},
		})

		return staffPaymentsCount
	}

	async getMany(query: StaffPaymentGetManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const staffPayments = await this.prisma.staffPaymentModel.findMany({
			where: { id: { in: query.ids }, description: query.description, staffId: query.staffId },
			...paginationOptions,
		})

		return staffPayments
	}

	async getOne(query: StaffPaymentGetOneRequest) {
		const staffPayment = await this.prisma.staffPaymentModel.findFirst({
			where: { id: query.id, description: query.description, staffId: query.staffId },
		})

		return staffPayment
	}

	async countGetMany(query: StaffPaymentGetManyRequest) {
		const staffsCount = await this.prisma.staffPaymentModel.count({
			where: { id: { in: query.ids }, description: query.description, staffId: query.staffId },
		})

		return staffsCount
	}

	async createOne(body: StaffPaymentCreateOneRequest) {
		const staffPayment = await this.prisma.staffPaymentModel.create({
			data: {
				staffId: body.staffId,
				description: body.description,
				sum: body.sum,
			},
		})
		return staffPayment
	}

	async updateOne(query: StaffPaymentGetOneRequest, body: StaffPaymentUpdateOneRequest) {
		const staffPayment = await this.prisma.staffPaymentModel.update({
			where: { id: query.id },
			data: {
				staffId: body.staffId,
				description: body.description,
				sum: body.sum,
				deletedAt: query.deletedAt,
			},
		})

		return staffPayment
	}

	async deleteOne(query: StaffPaymentDeleteOneRequest) {
		const staffPayment = await this.prisma.staffPaymentModel.delete({
			where: { id: query.id },
		})

		return staffPayment
	}

	async onModuleInit() {
		await this.prisma.createActionMethods(StaffPaymentController)
	}
}
