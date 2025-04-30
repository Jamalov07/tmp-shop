import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaService } from '../../shared/prisma'
import {
	PartnerRoleCreateOneRequest,
	PartnerRoleDeleteOneRequest,
	PartnerRoleFindManyRequest,
	PartnerRoleFindOneRequest,
	PartnerRoleGetManyRequest,
	PartnerRoleGetOneRequest,
	PartnerRoleUpdateOneRequest,
} from '../interfaces'
import { PartnerRoleController } from './partner-role.controller'
import { PartnerRoleEnum } from '@prisma/client'

@Injectable()
export class PartnerRoleRepository implements OnModuleInit {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async findMany(query: PartnerRoleFindManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const partnerRoles = await this.prisma.partnerRoleModel.findMany({
			where: {
				id: { in: query.ids },
				name: query.name,
			},
			select: { id: true, name: true, createdAt: true, actions: { select: { id: true, name: true, method: true, description: true, url: true } } },
			...paginationOptions,
		})

		return partnerRoles
	}

	async findOne(query: PartnerRoleFindOneRequest) {
		const partnerRole = await this.prisma.partnerRoleModel.findFirst({
			where: {
				id: query.id,
				name: query.name,
			},
			select: { id: true, name: true, createdAt: true, actions: { select: { id: true, name: true, method: true, description: true, url: true } } },
		})

		return partnerRole
	}

	async countFindMany(query: PartnerRoleFindManyRequest) {
		const partnerRolesCount = await this.prisma.partnerRoleModel.count({
			where: {
				id: { in: query.ids },
				name: query.name,
			},
		})

		return partnerRolesCount
	}

	async getMany(query: PartnerRoleGetManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const partnerRoles = await this.prisma.partnerRoleModel.findMany({
			where: { id: { in: query.ids }, name: query.name },
			...paginationOptions,
		})

		return partnerRoles
	}

	async getOne(query: PartnerRoleGetOneRequest) {
		const partnerRole = await this.prisma.partnerRoleModel.findFirst({
			where: { id: query.id, name: query.name },
		})

		return partnerRole
	}

	async countGetMany(query: PartnerRoleGetManyRequest) {
		const partnerRolesCount = await this.prisma.partnerRoleModel.count({
			where: { id: { in: query.ids }, name: query.name },
		})

		return partnerRolesCount
	}

	async createOne(body: PartnerRoleCreateOneRequest) {
		const partnerRole = await this.prisma.partnerRoleModel.create({
			data: { name: body.name, actions: { connect: body.actionsToConnect.map((a) => ({ id: a })) } },
		})
		return partnerRole
	}

	async updateOne(query: PartnerRoleGetOneRequest, body: PartnerRoleUpdateOneRequest) {
		const partnerRole = await this.prisma.partnerRoleModel.update({
			where: { id: query.id },
			data: {
				actions: {
					connect: body.actionsToConnect.map((a) => ({ id: a })),
					disconnect: body.actionsToDisconnect.map((a) => ({ id: a })),
				},
			},
		})

		return partnerRole
	}

	async deleteOne(query: PartnerRoleDeleteOneRequest) {
		const partnerRole = await this.prisma.partnerRoleModel.delete({
			where: { id: query.id },
		})

		return partnerRole
	}

	async onModuleInit() {
		await this.prisma.partnerRoleModel.createMany({ skipDuplicates: true, data: Object.values(PartnerRoleEnum).map((n) => ({ name: n })) })
		await this.prisma.createActionMethods(PartnerRoleController)
	}
}
