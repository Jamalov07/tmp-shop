import { Injectable } from '@nestjs/common'
import { PrismaService } from '../shared'
import {
	SupplierCreateOneRequest,
	SupplierDeleteOneRequest,
	SupplierFindManyRequest,
	SupplierFindOneRequest,
	SupplierGetManyRequest,
	SupplierGetOneRequest,
	SupplierUpdateOneRequest,
} from './interfaces'
import { SupplierController } from './supplier.controller'
import { deletedAtConverter } from '../../common'

@Injectable()
export class SupplierRepository {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async findMany(query: SupplierFindManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const suppliers = await this.prisma.supplierModel.findMany({
			where: {
				deletedAt: deletedAtConverter(query.isDeleted),
				OR: [
					{ phone: { contains: query.phone, mode: 'insensitive' } },
					{ fullname: { contains: query.fullname, mode: 'insensitive' } },
					{ phone: { contains: query.search, mode: 'insensitive' } },
					{ fullname: { contains: query.search, mode: 'insensitive' } },
				],
			},

			...paginationOptions,
		})

		return suppliers
	}

	async findOne(query: SupplierFindOneRequest) {
		const supplier = await this.prisma.supplierModel.findFirst({
			where: { id: query.id },
		})

		return supplier
	}

	async countFindMany(query: SupplierFindManyRequest) {
		const suppliersCount = await this.prisma.supplierModel.count({
			where: {
				deletedAt: deletedAtConverter(query.isDeleted),
				OR: [
					{ phone: { contains: query.phone, mode: 'insensitive' } },
					{ fullname: { contains: query.fullname, mode: 'insensitive' } },
					{ phone: { contains: query.search, mode: 'insensitive' } },
					{ fullname: { contains: query.search, mode: 'insensitive' } },
				],
			},
		})

		return suppliersCount
	}

	async getMany(query: SupplierGetManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const suppliers = await this.prisma.supplierModel.findMany({
			where: {
				id: { in: query.ids },
				phone: query.phone,
				fullname: query.fullname,
				deletedAt: deletedAtConverter(query.isDeleted),
			},
			...paginationOptions,
		})

		return suppliers
	}

	async getOne(query: SupplierGetOneRequest) {
		const supplier = await this.prisma.supplierModel.findFirst({
			where: {
				id: query.id,
				phone: query.phone,
				fullname: query.fullname,
				deletedAt: deletedAtConverter(query.isDeleted),
			},
		})

		return supplier
	}

	async countGetMany(query: SupplierGetManyRequest) {
		const suppliersCount = await this.prisma.supplierModel.count({
			where: {
				id: { in: query.ids },
				phone: query.phone,
				fullname: query.fullname,
				deletedAt: deletedAtConverter(query.isDeleted),
			},
		})

		return suppliersCount
	}

	async createOne(body: SupplierCreateOneRequest) {
		const supplier = await this.prisma.supplierModel.create({
			data: {
				phone: body.phone,
				fullname: body.fullname,
			},
		})
		return supplier
	}

	async updateOne(query: SupplierGetOneRequest, body: SupplierUpdateOneRequest) {
		const supplier = await this.prisma.supplierModel.update({
			where: { id: query.id },
			data: {
				phone: body.phone,
				fullname: body.fullname,
				deletedAt: body.deletedAt,
				balance: body.balance,
			},
		})

		return supplier
	}

	async deleteOne(query: SupplierDeleteOneRequest) {
		const supplier = await this.prisma.supplierModel.delete({
			where: { id: query.id },
		})
		return supplier
	}

	async onModuleInit() {
		await this.prisma.createActionMethods(SupplierController)
	}
}
