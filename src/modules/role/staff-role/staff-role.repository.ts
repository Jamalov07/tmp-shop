import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaService } from '../../shared'
import {
	StaffRoleCreateOneRequest,
	StaffRoleDeleteOneRequest,
	StaffRoleFindManyRequest,
	StaffRoleFindOneRequest,
	StaffRoleGetManyRequest,
	StaffRoleGetOneRequest,
	StaffRoleUpdateOneRequest,
} from '../interfaces'
import { StaffRoleController } from './staff-role.controller'
import { StaffRoleEnum } from '@prisma/client'

@Injectable()
export class StaffRoleRepository implements OnModuleInit {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async findMany(query: StaffRoleFindManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const roles = await this.prisma.staffRoleModel.findMany({
			where: {
				id: { in: query.ids },
				name: query.name,
			},
			select: { id: true, name: true, createdAt: true, actions: { select: { id: true, name: true, method: true, description: true, url: true } } },
			...paginationOptions,
		})

		return roles
	}

	async findOne(query: StaffRoleFindOneRequest) {
		const role = await this.prisma.staffRoleModel.findFirst({
			where: {
				id: query.id,
				name: query.name,
			},
			select: { id: true, name: true, createdAt: true, actions: { select: { id: true, name: true, method: true, description: true, url: true } } },
		})

		return role
	}

	async countFindMany(query: StaffRoleFindManyRequest) {
		const rolesCount = await this.prisma.staffRoleModel.count({
			where: {
				id: { in: query.ids },
				name: query.name,
			},
		})

		return rolesCount
	}

	async getMany(query: StaffRoleGetManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const roles = await this.prisma.staffRoleModel.findMany({
			where: { id: { in: query.ids }, name: query.name },
			...paginationOptions,
		})

		return roles
	}

	async getOne(query: StaffRoleGetOneRequest) {
		const role = await this.prisma.staffRoleModel.findFirst({
			where: { id: query.id, name: query.name },
		})

		return role
	}

	async countGetMany(query: StaffRoleGetManyRequest) {
		const rolesCount = await this.prisma.staffRoleModel.count({
			where: { id: { in: query.ids }, name: query.name },
		})

		return rolesCount
	}

	async createOne(body: StaffRoleCreateOneRequest) {
		const role = await this.prisma.staffRoleModel.create({
			data: {
				name: body.name,
				actions: { connect: body.actionsToConnect.map((a) => ({ id: a })) },
			},
		})
		return role
	}

	async updateOne(query: StaffRoleGetOneRequest, body: StaffRoleUpdateOneRequest) {
		const role = await this.prisma.staffRoleModel.update({
			where: { id: query.id },
			data: {
				actions: {
					connect: body.actionsToConnect.map((a) => ({ id: a })),
					disconnect: body.actionsToDisconnect.map((a) => ({ id: a })),
				},
			},
		})

		return role
	}

	async deleteOne(query: StaffRoleDeleteOneRequest) {
		const role = await this.prisma.staffRoleModel.delete({
			where: { id: query.id },
		})

		return role
	}

	async onModuleInit() {
		await this.prisma.staffRoleModel.createMany({ skipDuplicates: true, data: Object.values(StaffRoleEnum).map((n) => ({ name: n })) })
		await this.prisma.createActionMethods(StaffRoleController)
	}
}
