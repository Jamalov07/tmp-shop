import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaService } from '../shared/prisma'
import {
	StaffCreateOneRequest,
	StaffDeleteOneRequest,
	StaffFindManyRequest,
	StaffFindOneRequest,
	StaffGetManyRequest,
	StaffGetOneRequest,
	StaffUpdateOneRequest,
} from './interfaces'
import { StaffController } from './staff.controller'

@Injectable()
export class StaffRepository implements OnModuleInit {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async findMany(query: StaffFindManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const staffs = await this.prisma.staffModel.findMany({
			where: {
				fullname: query.fullname,
				roles: { some: { name: { in: query.roleNames } } },
				OR: [{ fullname: { contains: query.search, mode: 'insensitive' } }, { phone: { contains: query.search, mode: 'insensitive' } }],
			},
			select: {
				id: true,
				fullname: true,
				phone: true,
				actions: true,
				roles: true,
				updatedAt: true,
				createdAt: true,
				deletedAt: true,
			},
			...paginationOptions,
		})

		return staffs
	}

	async findOne(query: StaffFindOneRequest) {
		const staff = await this.prisma.staffModel.findFirst({
			where: { id: query.id },
			select: {
				id: true,
				fullname: true,
				phone: true,
				actions: true,
				roles: true,
				updatedAt: true,
				createdAt: true,
				deletedAt: true,
			},
		})

		return staff
	}

	async countFindMany(query: StaffFindManyRequest) {
		const staffsCount = await this.prisma.staffModel.count({
			where: {
				fullname: query.fullname,
				roles: { some: { name: { in: query.roleNames } } },
				OR: [{ fullname: { contains: query.search, mode: 'insensitive' } }, { phone: { contains: query.search, mode: 'insensitive' } }],
			},
		})

		return staffsCount
	}

	async getMany(query: StaffGetManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const staffs = await this.prisma.staffModel.findMany({
			where: { id: { in: query.ids }, fullname: query.fullname },
			...paginationOptions,
		})

		return staffs
	}

	async getOne(query: StaffGetOneRequest) {
		const staff = await this.prisma.staffModel.findFirst({
			where: { id: query.id, fullname: query.fullname, phone: query.phone },
			select: { id: true, fullname: true, phone: true, createdAt: true, deletedAt: true, roles: true, password: true, token: true },
		})

		return staff
	}

	async countGetMany(query: StaffGetManyRequest) {
		const staffsCount = await this.prisma.staffModel.count({
			where: { id: { in: query.ids }, fullname: query.fullname },
		})

		return staffsCount
	}

	async createOne(body: StaffCreateOneRequest) {
		const staff = await this.prisma.staffModel.create({
			data: {
				fullname: body.fullname,
				password: body.password,
				phone: body.phone,
				roles: { connect: body.rolesToConnect.map((r) => ({ id: r })) },
				actions: { connect: body.actionsToConnect.map((r) => ({ id: r })) },
			},
		})
		return staff
	}

	async updateOne(query: StaffGetOneRequest, body: StaffUpdateOneRequest) {
		const staff = await this.prisma.staffModel.update({
			where: { id: query.id },
			data: {
				fullname: body.fullname,
				password: body.password,
				phone: body.phone,
				token: body.token,
				deletedAt: body.deletedAt,
				roles: {
					connect: (body.rolesToConnect ?? []).map((r) => ({ id: r })),
					disconnect: (body.rolesToDisconnect ?? []).map((r) => ({ id: r })),
				},
				actions: {
					connect: (body.actionsToConnect ?? []).map((r) => ({ id: r })),
					disconnect: (body.actionsToDisconnect ?? []).map((r) => ({ id: r })),
				},
			},
		})

		return staff
	}

	async deleteOne(query: StaffDeleteOneRequest) {
		const staff = await this.prisma.staffModel.delete({
			where: { id: query.id },
		})

		return staff
	}

	async onModuleInit() {
		await this.prisma.createActionMethods(StaffController)
	}
}
