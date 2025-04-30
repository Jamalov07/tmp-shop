import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaService } from '../shared/prisma'
import {
	PartnerCreateOneRequest,
	PartnerDeleteOneRequest,
	PartnerFindManyRequest,
	PartnerFindOneRequest,
	PartnerGetManyRequest,
	PartnerGetOneRequest,
	PartnerUpdateOneRequest,
} from './interfaces'
import { PartnerController } from './partner.controller'
import { PartnerRoleEnum } from '@prisma/client'

@Injectable()
export class PartnerRepository implements OnModuleInit {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async findMany(query: PartnerFindManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const partners = await this.prisma.partnerModel.findMany({
			where: {
				roles: { some: { name: { in: query.roleNames } } },
				fullname: query.fullname,
			},
			select: {
				id: true,
				fullname: true,
				phone: true,
				balance: true,
				whereFrom: true,
				actions: true,
				roles: true,
				updatedAt: true,
				createdAt: true,
				deletedAt: true,
			},

			...paginationOptions,
		})

		return partners
	}

	async findManyProvider(query: PartnerFindManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const partners = await this.prisma.partnerModel.findMany({
			where: {
				fullname: query.fullname,
				roles: { some: { name: PartnerRoleEnum.provider } },
			},
			select: {
				id: true,
				fullname: true,
				phone: true,
				balance: true,
				whereFrom: true,
				actions: true,
				roles: true,
				updatedAt: true,
				createdAt: true,
				deletedAt: true,
			},

			...paginationOptions,
		})

		return partners
	}

	async findOne(query: PartnerFindOneRequest) {
		const partner = await this.prisma.partnerModel.findFirst({
			where: { id: query.id },
			select: {
				id: true,
				fullname: true,
				phone: true,
				balance: true,
				whereFrom: true,
				actions: true,
				roles: true,
				updatedAt: true,
				createdAt: true,
				deletedAt: true,
			},
		})

		return partner
	}

	async countFindMany(query: PartnerFindManyRequest) {
		const partnersCount = await this.prisma.partnerModel.count({
			where: {
				roles: { some: { name: { in: query.roleNames } } },
				fullname: query.fullname,
			},
		})

		return partnersCount
	}

	async countFindManyProvider(query: PartnerFindManyRequest) {
		const partnersCount = await this.prisma.partnerModel.count({
			where: {
				fullname: query.fullname,
				roles: { some: { name: PartnerRoleEnum.provider } },
			},
		})

		return partnersCount
	}

	async getMany(query: PartnerGetManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const partners = await this.prisma.partnerModel.findMany({
			where: { id: { in: query.ids }, fullname: query.fullname },
			...paginationOptions,
		})

		return partners
	}

	async getOne(query: PartnerGetOneRequest) {
		const partner = await this.prisma.partnerModel.findFirst({
			where: { id: query.id, fullname: query.fullname, phone: query.phone },
			select: { id: true, balance: true, createdAt: true, fullname: true, phone: true, roles: true, token: true, orders: true },
		})

		return partner
	}

	async countGetMany(query: PartnerGetManyRequest) {
		const partnersCount = await this.prisma.partnerModel.count({
			where: { id: { in: query.ids }, fullname: query.fullname },
		})

		return partnersCount
	}

	async createOne(body: PartnerCreateOneRequest) {
		const partner = await this.prisma.partnerModel.create({
			data: {
				fullname: body.fullname,
				whereFrom: body.whereFrom,
				password: body.password,
				phone: body.phone,
				roles: { connect: body.rolesToConnect.map((r) => ({ id: r })) },
				actions: { connect: body.actionsToConnect.map((r) => ({ id: r })) },
			},
		})
		return partner
	}

	async updateOne(query: PartnerGetOneRequest, body: PartnerUpdateOneRequest) {
		const partner = await this.prisma.partnerModel.update({
			where: { id: query.id },
			data: {
				balance: body.balance,
				fullname: body.fullname,
				whereFrom: body.whereFrom,
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

		return partner
	}

	async deleteOne(query: PartnerDeleteOneRequest) {
		const partner = await this.prisma.partnerModel.delete({
			where: { id: query.id },
		})

		return partner
	}

	async onModuleInit() {
		await this.prisma.createActionMethods(PartnerController)
	}
}
