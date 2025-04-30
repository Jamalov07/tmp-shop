import { Injectable } from '@nestjs/common'
import { PrismaService } from '../shared'
import {
	OrderProductCreateOneRequest,
	OrderProductDeleteOneRequest,
	OrderProductFindManyRequest,
	OrderProductFindOneRequest,
	OrderProductGetManyRequest,
	OrderProductGetOneRequest,
	OrderProductUpdateOneRequest,
} from './interfaces'
import { deletedAtConverter } from '../../common'
import { OrderProductController } from './order-product.controller'

@Injectable()
export class OrderProductRepository {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async findMany(query: OrderProductFindManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const orderProducts = await this.prisma.orderProductModel.findMany({
			where: {
				deletedAt: deletedAtConverter(query.isDeleted),
				description: { contains: query.description, mode: 'insensitive' },
				publicId: { contains: query.publicId, mode: 'insensitive' },
				tissue: { contains: query.tissue, mode: 'insensitive' },
				modelId: query.modelId,
				orderId: query.orderId,
				direction: query.direction,
				model: { providerId: query.modelProviderId },
			},
			...paginationOptions,
		})

		return orderProducts
	}

	async findOne(query: OrderProductFindOneRequest) {
		const staff = await this.prisma.orderProductModel.findFirst({
			where: {
				id: query.id,
			},
		})

		return staff
	}

	async countFindMany(query: OrderProductFindManyRequest) {
		const orderProductCount = await this.prisma.orderProductModel.count({
			where: {
				deletedAt: deletedAtConverter(query.isDeleted),
				description: { contains: query.description, mode: 'insensitive' },
				publicId: { contains: query.publicId, mode: 'insensitive' },
				tissue: { contains: query.tissue, mode: 'insensitive' },
				modelId: query.modelId,
				orderId: query.orderId,
				direction: query.direction,
				model: { providerId: query.modelProviderId },
			},
		})

		return orderProductCount
	}

	async getMany(query: OrderProductGetManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const orderProducts = await this.prisma.orderProductModel.findMany({
			where: {
				id: { in: query.ids },
				deletedAt: deletedAtConverter(query.isDeleted),
				description: query.description,
				publicId: query.publicId,
				tissue: query.tissue,
				orderId: query.orderId,
				modelId: query.modelId,
				direction: query.direction,
			},
			...paginationOptions,
		})

		return orderProducts
	}

	async getOne(query: OrderProductGetOneRequest) {
		const staff = await this.prisma.orderProductModel.findFirst({
			where: {
				id: query.id,
				description: query.description,
			},
		})

		return staff
	}

	async countGetMany(query: OrderProductGetManyRequest) {
		const orderProductCount = await this.prisma.orderProductModel.count({
			where: {
				id: { in: query.ids },
				deletedAt: deletedAtConverter(query.isDeleted),
				description: query.description,
				publicId: query.publicId,
				tissue: query.tissue,
				orderId: query.orderId,
				modelId: query.modelId,
				direction: query.direction,
			},
		})

		return orderProductCount
	}

	async createOne(body: OrderProductCreateOneRequest) {
		const orderProduct = await this.prisma.orderProductModel.create({
			data: {
				description: body.description,
				direction: body.direction,
				publicId: body.publicId,
				orderId: body.orderId,
				tissue: body.tissue,
				totalSum: body.totalSum,
				sale: body.sale,
				price: body.price,
				priceWithSale: body.priceWithSale,
				quantity: body.quantity,
				modelId: body.modelId,
			},
		})
		return orderProduct
	}

	async createMany(body: OrderProductCreateOneRequest[]) {
		const orderProducts = await this.prisma.orderProductModel.createManyAndReturn({
			data: body.map((orp) => {
				return {
					description: orp.description,
					direction: orp.direction,
					publicId: orp.publicId,
					orderId: orp.orderId,
					tissue: orp.tissue,
					totalSum: orp.totalSum,
					sale: orp.sale,
					price: orp.price,
					priceWithSale: orp.priceWithSale,
					quantity: orp.quantity,
					modelId: orp.modelId,
				}
			}),
			select: {
				id: true,
				createdAt: true,
				description: true,
				direction: true,
				model: { select: { name: true, furnitureType: { select: { name: true } } } },
				price: true,
				priceWithSale: true,
				quantity: true,
				sale: true,
				publicId: true,
				tissue: true,
				totalSum: true,
				status: true,
			},
		})
		return orderProducts
	}

	async updateOne(query: OrderProductGetOneRequest, body: OrderProductUpdateOneRequest) {
		const orderProduct = await this.prisma.orderProductModel.update({
			where: { id: query.id },
			data: {
				description: body.description,
				direction: body.direction,
				publicId: body.publicId,
				tissue: body.tissue,
				totalSum: body.totalSum,
				sale: body.sale,
				orderId: body.orderId,
				price: body.price,
				priceWithSale: body.priceWithSale,
				quantity: body.quantity,
				modelId: body.modelId,
				status: body.status,
			},
		})

		return orderProduct
	}

	async deleteOne(query: OrderProductDeleteOneRequest) {
		const orderProduct = await this.prisma.orderProductModel.delete({
			where: { id: query.id },
		})
		return orderProduct
	}

	async onModuleInit() {
		await this.prisma.createActionMethods(OrderProductController)
	}
}
