import { Injectable } from '@nestjs/common'
import { PrismaService } from '../shared'
import {
	FurnitureTypeCreateOneRequest,
	FurnitureTypeDeleteOneRequest,
	FurnitureTypeFindManyRequest,
	FurnitureTypeFindOneRequest,
	FurnitureTypeGetManyRequest,
	FurnitureTypeGetOneRequest,
	FurnitureTypeUpdateOneRequest,
} from './interfaces'
import { deletedAtConverter } from '../../common'
import { FurnitureTypeController } from './furniture-type.controller'

@Injectable()
export class FurnitureTypeRepository {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async findMany(query: FurnitureTypeFindManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const furnitureTypes = await this.prisma.furnitureTypeModel.findMany({
			where: {
				deletedAt: deletedAtConverter(query.isDeleted),
				name: { contains: query.name, mode: 'insensitive' },
			},
			...paginationOptions,
		})

		return furnitureTypes
	}

	async findOne(query: FurnitureTypeFindOneRequest) {
		const staff = await this.prisma.furnitureTypeModel.findFirst({
			where: {
				id: query.id,
			},
		})

		return staff
	}

	async countFindMany(query: FurnitureTypeFindManyRequest) {
		const furnitureTypeCount = await this.prisma.furnitureTypeModel.count({
			where: {
				deletedAt: deletedAtConverter(query.isDeleted),
				name: { contains: query.name, mode: 'insensitive' },
			},
		})

		return furnitureTypeCount
	}

	async getMany(query: FurnitureTypeGetManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const furnitureTypes = await this.prisma.furnitureTypeModel.findMany({
			where: {
				id: { in: query.ids },
				deletedAt: deletedAtConverter(query.isDeleted),
				name: query.name,
			},
			...paginationOptions,
		})

		return furnitureTypes
	}

	async getOne(query: FurnitureTypeGetOneRequest) {
		const staff = await this.prisma.furnitureTypeModel.findFirst({
			where: {
				id: query.id,
				name: query.name,
			},
		})

		return staff
	}

	async countGetMany(query: FurnitureTypeGetManyRequest) {
		const furnitureTypeCount = await this.prisma.furnitureTypeModel.count({
			where: {
				id: { in: query.ids },
				deletedAt: deletedAtConverter(query.isDeleted),
				name: query.name,
			},
		})

		return furnitureTypeCount
	}

	async createOne(body: FurnitureTypeCreateOneRequest) {
		const furnitureType = await this.prisma.furnitureTypeModel.create({
			data: { name: body.name },
		})
		return furnitureType
	}

	async updateOne(query: FurnitureTypeGetOneRequest, body: FurnitureTypeUpdateOneRequest) {
		const furnitureType = await this.prisma.furnitureTypeModel.update({
			where: { id: query.id },
			data: { name: body.name },
		})

		return furnitureType
	}

	async deleteOne(query: FurnitureTypeDeleteOneRequest) {
		const furnitureType = await this.prisma.furnitureTypeModel.delete({
			where: { id: query.id },
		})
		return furnitureType
	}

	async onModuleInit() {
		await this.prisma.createActionMethods(FurnitureTypeController)
	}
}
