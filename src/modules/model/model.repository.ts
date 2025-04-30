import { Injectable } from '@nestjs/common'
import { PrismaService } from '../shared'
import {
	ModelCreateOneRequest,
	ModelDeleteOneRequest,
	ModelFindManyRequest,
	ModelFindOneRequest,
	ModelGetManyRequest,
	ModelGetOneRequest,
	ModelUpdateOneRequest,
} from './interfaces'
import { deletedAtConverter } from '../../common'
import { ModelController } from './model.controller'

@Injectable()
export class ModelRepository {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async findMany(query: ModelFindManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const models = await this.prisma.modelModel.findMany({
			where: {
				deletedAt: deletedAtConverter(query.isDeleted),
				name: { contains: query.name, mode: 'insensitive' },
			},
			select: { id: true, name: true, createdAt: true, updatedAt: true, deletedAt: true, furnitureType: true, provider: true },
			...paginationOptions,
		})

		return models
	}

	async findOne(query: ModelFindOneRequest) {
		const staff = await this.prisma.modelModel.findFirst({
			where: {
				id: query.id,
			},
			select: { id: true, name: true, createdAt: true, updatedAt: true, deletedAt: true, furnitureType: true, provider: true },
		})

		return staff
	}

	async countFindMany(query: ModelFindManyRequest) {
		const modelCount = await this.prisma.modelModel.count({
			where: {
				deletedAt: deletedAtConverter(query.isDeleted),
				name: { contains: query.name, mode: 'insensitive' },
			},
		})

		return modelCount
	}

	async getMany(query: ModelGetManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const models = await this.prisma.modelModel.findMany({
			where: {
				id: { in: query.ids },
				deletedAt: deletedAtConverter(query.isDeleted),
				name: query.name,
			},
			...paginationOptions,
		})

		return models
	}

	async getOne(query: ModelGetOneRequest) {
		const staff = await this.prisma.modelModel.findFirst({
			where: {
				id: query.id,
				name: query.name,
			},
		})

		return staff
	}

	async countGetMany(query: ModelFindManyRequest) {
		const modelCount = await this.prisma.modelModel.count({
			where: {
				id: { in: query.ids },
				deletedAt: deletedAtConverter(query.isDeleted),
				name: query.name,
			},
		})

		return modelCount
	}

	async createOne(body: ModelCreateOneRequest) {
		const model = await this.prisma.modelModel.create({
			data: { name: body.name, furnitureTypeId: body.furnitureTypeId, providerId: body.providerId },
		})
		return model
	}

	async updateOne(query: ModelGetOneRequest, body: ModelUpdateOneRequest) {
		const model = await this.prisma.modelModel.update({
			where: { id: query.id },
			data: { name: body.name, furnitureTypeId: body.furnitureTypeId, providerId: body.providerId },
		})

		return model
	}

	async deleteOne(query: ModelDeleteOneRequest) {
		const model = await this.prisma.modelModel.delete({
			where: { id: query.id },
		})
		return model
	}

	async onModuleInit() {
		await this.prisma.createActionMethods(ModelController)
	}
}
