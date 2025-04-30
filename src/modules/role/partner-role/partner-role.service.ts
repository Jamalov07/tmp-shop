import { BadRequestException, Injectable } from '@nestjs/common'
import { PartnerRoleRepository } from './partner-role.repository'
import { createResponse } from '@common'
import {
	PartnerRoleGetOneRequest,
	PartnerRoleCreateOneRequest,
	PartnerRoleUpdateOneRequest,
	PartnerRoleGetManyRequest,
	PartnerRoleFindManyRequest,
	PartnerRoleFindOneRequest,
} from '../interfaces'

@Injectable()
export class PartnerRoleService {
	private readonly roleRepository: PartnerRoleRepository

	constructor(roleRepository: PartnerRoleRepository) {
		this.roleRepository = roleRepository
	}

	async findMany(query: PartnerRoleFindManyRequest) {
		const roles = await this.roleRepository.findMany(query)
		const rolesCount = await this.roleRepository.countFindMany(query)

		const result = query.pagination
			? {
					totalCount: rolesCount,
					pagesCount: Math.ceil(rolesCount / query.pageSize),
					pageSize: roles.length,
					data: roles,
				}
			: { data: roles }

		return createResponse({ data: result, success: { messages: ['find many success'] } })
	}

	async findOne(query: PartnerRoleFindOneRequest) {
		const role = await this.roleRepository.findOne(query)

		if (!role) {
			throw new BadRequestException('role not found')
		}

		return createResponse({ data: role, success: { messages: ['find one success'] } })
	}

	async getMany(query: PartnerRoleGetManyRequest) {
		const roles = await this.roleRepository.getMany(query)
		const rolesCount = await this.roleRepository.countGetMany(query)

		const result = query.pagination
			? {
					pagesCount: Math.ceil(rolesCount / query.pageSize),
					pageSize: roles.length,
					data: roles,
				}
			: { data: roles }

		return createResponse({ data: result, success: { messages: ['get many success'] } })
	}

	async getOne(query: PartnerRoleGetOneRequest) {
		const role = await this.roleRepository.getOne(query)

		if (!role) {
			throw new BadRequestException('role not found')
		}

		return createResponse({ data: role, success: { messages: ['get one success'] } })
	}

	async updateOne(query: PartnerRoleGetOneRequest, body: PartnerRoleUpdateOneRequest) {
		await this.getOne(query)

		await this.roleRepository.updateOne(query, { ...body })

		return createResponse({ data: null, success: { messages: ['update one success'] } })
	}
}
