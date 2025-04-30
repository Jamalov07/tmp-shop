import { BadRequestException, Injectable } from '@nestjs/common'
import { StaffRoleRepository } from './staff-role.repository'
import { createResponse } from '@common'
import {
	StaffRoleGetOneRequest,
	StaffRoleCreateOneRequest,
	StaffRoleUpdateOneRequest,
	StaffRoleGetManyRequest,
	StaffRoleFindManyRequest,
	StaffRoleFindOneRequest,
} from '../interfaces'

@Injectable()
export class StaffRoleService {
	private readonly roleRepository: StaffRoleRepository

	constructor(roleRepository: StaffRoleRepository) {
		this.roleRepository = roleRepository
	}

	async findMany(query: StaffRoleFindManyRequest) {
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

	async findOne(query: StaffRoleFindOneRequest) {
		const role = await this.roleRepository.findOne(query)

		if (!role) {
			throw new BadRequestException('staff role not found')
		}

		return createResponse({ data: role, success: { messages: ['find one success'] } })
	}

	async getMany(query: StaffRoleGetManyRequest) {
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

	async getOne(query: StaffRoleGetOneRequest) {
		const role = await this.roleRepository.getOne(query)

		if (!role) {
			throw new BadRequestException('staff role not found')
		}

		return createResponse({ data: role, success: { messages: ['get one success'] } })
	}

	async updateOne(query: StaffRoleGetOneRequest, body: StaffRoleUpdateOneRequest) {
		await this.getOne(query)

		await this.roleRepository.updateOne(query, { ...body })

		return createResponse({ data: null, success: { messages: ['update one success'] } })
	}
}
