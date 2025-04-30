import { BadRequestException, Injectable } from '@nestjs/common'
import { ModelRepository } from './model.repository'
import {
	ModelCreateOneRequest,
	ModelDeleteOneRequest,
	ModelFindManyRequest,
	ModelFindOneRequest,
	ModelGetManyRequest,
	ModelGetOneRequest,
	ModelUpdateOneRequest,
} from './interfaces'
import { createResponse, DeleteMethodEnum } from '../../common'
import { PartnerService } from '../partner'
import { PartnerRoleEnum } from '@prisma/client'

@Injectable()
export class ModelService {
	private readonly modelRepository: ModelRepository
	private readonly partnerService: PartnerService
	constructor(modelRepository: ModelRepository, partnerService: PartnerService) {
		this.modelRepository = modelRepository
		this.partnerService = partnerService
	}

	async findMany(query: ModelFindManyRequest) {
		const models = await this.modelRepository.findMany(query)
		const modelsCount = await this.modelRepository.countFindMany(query)

		const result = query.pagination
			? {
					totalCount: modelsCount,
					pagesCount: Math.ceil(modelsCount / query.pageSize),
					pageSize: models.length,
					data: models,
				}
			: { data: models }

		return createResponse({ data: result, success: { messages: ['find many success'] } })
	}

	async findOne(query: ModelFindOneRequest) {
		const model = await this.modelRepository.findOne(query)

		if (!model) {
			throw new BadRequestException('model not found')
		}
		return createResponse({ data: { ...model }, success: { messages: ['find one success'] } })
	}

	async getMany(query: ModelGetManyRequest) {
		const models = await this.modelRepository.getMany(query)
		const modelsCount = await this.modelRepository.countGetMany(query)

		const result = query.pagination
			? {
					pagesCount: Math.ceil(modelsCount / query.pageSize),
					pageSize: models.length,
					data: models,
				}
			: { data: models }

		return createResponse({ data: result, success: { messages: ['get many success'] } })
	}

	async getOne(query: ModelGetOneRequest) {
		const model = await this.modelRepository.getOne(query)

		if (!model) {
			throw new BadRequestException('model not found')
		}

		return createResponse({ data: model, success: { messages: ['get one success'] } })
	}

	async createOne(body: ModelCreateOneRequest) {
		const candidate = await this.modelRepository.getOne({ name: body.name })
		if (candidate) {
			throw new BadRequestException('name already exists')
		}

		const provider = await this.partnerService.getOne({ id: body.providerId })
		const providerRole = provider.data.roles.find((r) => r.name === PartnerRoleEnum.provider)
		if (!providerRole) {
			throw new BadRequestException('provider not found')
		}

		await this.modelRepository.createOne({ ...body })

		return createResponse({ data: null, success: { messages: ['create one success'] } })
	}

	async updateOne(query: ModelGetOneRequest, body: ModelUpdateOneRequest) {
		await this.getOne(query)

		if (body.name) {
			const candidate = await this.modelRepository.getOne({ name: body.name })
			if (candidate && candidate.id !== query.id) {
				throw new BadRequestException('name already exists')
			}
		}

		if (body.providerId) {
			const provider = await this.partnerService.getOne({ id: body.providerId })
			const providerRole = provider.data.roles.find((r) => r.name === PartnerRoleEnum.provider)
			if (!providerRole) {
				throw new BadRequestException('provider not found')
			}
		}

		await this.modelRepository.updateOne(query, { ...body })

		return createResponse({ data: null, success: { messages: ['update one success'] } })
	}

	async deleteOne(query: ModelDeleteOneRequest) {
		await this.getOne(query)
		if (query.method === DeleteMethodEnum.hard) {
			await this.modelRepository.deleteOne(query)
		} else {
			await this.modelRepository.updateOne(query, { deletedAt: new Date() })
		}
		return createResponse({ data: null, success: { messages: ['delete one success'] } })
	}
}
