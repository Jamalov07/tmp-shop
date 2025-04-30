import { Injectable } from '@nestjs/common'
import { PrismaService } from '../shared'
import {
	OrderCreateOneRequest,
	OrderDeleteOneRequest,
	OrderFindManyRequest,
	OrderFindOneRequest,
	OrderGetManyRequest,
	OrderGetOneRequest,
	OrderUpdateOneRequest,
} from './interfaces'
import { deletedAtConverter } from '../../common'
import { OrderController } from './order.controller'

@Injectable()
export class OrderRepository {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async findMany(query: OrderFindManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const orders = await this.prisma.orderModel.findMany({
			where: {
				deletedAt: deletedAtConverter(query.isDeleted),
				deliveryAddress: { contains: query.deliveryAddress, mode: 'insensitive' },
				clientId: query.clientId,
				staffId: query.staffId,
				OR: [
					{ client: { phone: { contains: query.search, mode: 'insensitive' } } },
					{ client: { fullname: { contains: query.search, mode: 'insensitive' } } },
					{ products: { some: { publicId: { contains: query.search, mode: 'insensitive' } } } },
				],
			},
			select: {
				id: true,
				createdAt: true,
				status: true,
				client: true,
				deliveryAddress: true,
				deliveryDate: true,
				payments: true,
				purchaseStatus: true,
				products: true,
			},
			...paginationOptions,
		})

		return orders
	}

	async findOne(query: OrderFindOneRequest) {
		const staff = await this.prisma.orderModel.findFirst({
			where: {
				id: query.id,
			},
			select: {
				id: true,
				createdAt: true,
				status: true,
				client: true,
				deliveryAddress: true,
				deliveryDate: true,
				payments: true,
				purchaseStatus: true,
				products: true,
			},
		})

		return staff
	}

	async countFindMany(query: OrderFindManyRequest) {
		const orderCount = await this.prisma.orderModel.count({
			where: {
				deletedAt: deletedAtConverter(query.isDeleted),
				deliveryAddress: { contains: query.deliveryAddress, mode: 'insensitive' },
				clientId: query.clientId,
				staffId: query.staffId,
				OR: [
					{ client: { phone: { contains: query.search, mode: 'insensitive' } } },
					{ client: { fullname: { contains: query.search, mode: 'insensitive' } } },
					{ products: { some: { publicId: { contains: query.search, mode: 'insensitive' } } } },
				],
			},
		})

		return orderCount
	}

	async getMany(query: OrderGetManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const orders = await this.prisma.orderModel.findMany({
			where: {
				id: { in: query.ids },
				deletedAt: deletedAtConverter(query.isDeleted),
				deliveryAddress: query.deliveryAddress,
				clientId: query.clientId,
				staffId: query.staffId,
			},
			...paginationOptions,
		})

		return orders
	}

	async getOne(query: OrderGetOneRequest) {
		const staff = await this.prisma.orderModel.findFirst({
			where: {
				id: query.id,
				deliveryAddress: query.deliveryAddress,
			},
		})

		return staff
	}

	async countGetMany(query: OrderGetManyRequest) {
		const orderCount = await this.prisma.orderModel.count({
			where: {
				id: { in: query.ids },
				deletedAt: deletedAtConverter(query.isDeleted),
				deliveryAddress: query.deliveryAddress,
				clientId: query.clientId,
				staffId: query.staffId,
			},
		})

		return orderCount
	}

	async createOne(body: OrderCreateOneRequest) {
		const order = await this.prisma.orderModel.create({
			data: {
				deliveryAddress: body.deliveryAddress,
				clientId: body.clientId,
				deliveryDate: new Date(body.deliveryDate),
				staffId: body.staffId,
				purchaseStatus: body.purchaseStatus,
			},
			select: { id: true, createdAt: true, client: true, deliveryAddress: true, deliveryDate: true, purchaseStatus: true, staff: true, status: true },
		})
		return order
	}

	async updateOne(query: OrderGetOneRequest, body: OrderUpdateOneRequest) {
		const order = await this.prisma.orderModel.update({
			where: { id: query.id },
			data: { deliveryAddress: body.deliveryAddress, clientId: body.clientId, staffId: body.staffId, deliveryDate: body.deliveryDate, status: body.status },
		})

		return order
	}

	async deleteOne(query: OrderDeleteOneRequest) {
		const order = await this.prisma.orderModel.delete({
			where: { id: query.id },
		})
		return order
	}

	async onModuleInit() {
		await this.prisma.createActionMethods(OrderController)
	}
}
