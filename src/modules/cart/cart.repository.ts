import { Injectable } from '@nestjs/common'
import { PrismaService } from '../shared'
import { CartCreateOneRequest, CartDeleteOneRequest, CartFindManyRequest, CartFindOneRequest, CartGetManyRequest, CartGetOneRequest, CartUpdateOneRequest } from './interfaces'
import { deletedAtConverter } from '../../common'
import { CartController } from './cart.controller'

@Injectable()
export class CartRepository {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async findMany(query: CartFindManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const carts = await this.prisma.cartModel.findMany({
			where: {
				deletedAt: deletedAtConverter(query.isDeleted),
				description: { contains: query.description, mode: 'insensitive' },
				publicId: { contains: query.publicId, mode: 'insensitive' },
				tissue: { contains: query.tissue, mode: 'insensitive' },
				staffId: query.staffId,
				modelId: query.modelId,
				direction: query.direction,
			},
			...paginationOptions,
		})

		return carts
	}

	async findOne(query: CartFindOneRequest) {
		const staff = await this.prisma.cartModel.findFirst({
			where: {
				id: query.id,
			},
		})

		return staff
	}

	async countFindMany(query: CartFindManyRequest) {
		const cartCount = await this.prisma.cartModel.count({
			where: {
				deletedAt: deletedAtConverter(query.isDeleted),
				description: { contains: query.description, mode: 'insensitive' },
				publicId: { contains: query.publicId, mode: 'insensitive' },
				tissue: { contains: query.tissue, mode: 'insensitive' },
				staffId: query.staffId,
				modelId: query.modelId,
				direction: query.direction,
			},
		})

		return cartCount
	}

	async getMany(query: CartGetManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const carts = await this.prisma.cartModel.findMany({
			where: {
				id: { in: query.ids },
				deletedAt: deletedAtConverter(query.isDeleted),
				description: query.description,
				publicId: query.publicId,
				tissue: query.tissue,
				staffId: query.staffId,
				modelId: query.modelId,
				direction: query.direction,
			},
			...paginationOptions,
		})

		return carts
	}

	async getOne(query: CartGetOneRequest) {
		const staff = await this.prisma.cartModel.findFirst({
			where: {
				id: query.id,
				description: query.description,
			},
		})

		return staff
	}

	async countGetMany(query: CartGetManyRequest) {
		const cartCount = await this.prisma.cartModel.count({
			where: {
				id: { in: query.ids },
				deletedAt: deletedAtConverter(query.isDeleted),
				description: query.description,
				publicId: query.publicId,
				tissue: query.tissue,
				staffId: query.staffId,
				modelId: query.modelId,
				direction: query.direction,
			},
		})

		return cartCount
	}

	async createOne(body: CartCreateOneRequest) {
		const cart = await this.prisma.cartModel.create({
			data: {
				description: body.description,
				direction: body.direction,
				publicId: body.publicId,
				tissue: body.tissue,
				totalSum: body.totalSum,
				staffId: body.staffId,
				sale: body.sale,
				price: body.price,
				priceWithSale: body.priceWithSale,
				quantity: body.quantity,
				modelId: body.modelId,
			},
		})
		return cart
	}

	async updateOne(query: CartGetOneRequest, body: CartUpdateOneRequest) {
		const cart = await this.prisma.cartModel.update({
			where: { id: query.id },
			data: {
				description: body.description,
				direction: body.direction,
				publicId: body.publicId,
				tissue: body.tissue,
				totalSum: body.totalSum,
				staffId: body.staffId,
				sale: body.sale,
				price: body.price,
				priceWithSale: body.priceWithSale,
				quantity: body.quantity,
				modelId: body.modelId,
			},
		})

		return cart
	}

	async deleteOne(query: CartDeleteOneRequest) {
		const cart = await this.prisma.cartModel.delete({
			where: { id: query.id },
		})
		return cart
	}

	async deleteMany(query: CartDeleteOneRequest[]) {
		const cart = await this.prisma.cartModel.deleteMany({
			where: { id: { in: query.map((q) => q.id) } },
		})
		return cart
	}

	async onModuleInit() {
		await this.prisma.createActionMethods(CartController)
	}
}
