import { BadRequestException, Injectable } from '@nestjs/common'
import { FurnitureTypeRepository } from './furniture-type.repository'
import {
	FurnitureTypeCreateOneRequest,
	FurnitureTypeDeleteOneRequest,
	FurnitureTypeFindManyRequest,
	FurnitureTypeFindOneRequest,
	FurnitureTypeGetManyRequest,
	FurnitureTypeGetOneRequest,
	FurnitureTypeUpdateOneRequest,
} from './interfaces'
import { createResponse, DeleteMethodEnum } from '../../common'

@Injectable()
export class FurnitureTypeService {
	private readonly furnitureTypeRepository: FurnitureTypeRepository
	constructor(furnitureTypeRepository: FurnitureTypeRepository) {
		this.furnitureTypeRepository = furnitureTypeRepository
	}

	async findMany(query: FurnitureTypeFindManyRequest) {
		const furnitureTypes = await this.furnitureTypeRepository.findMany(query)
		const furnitureTypesCount = await this.furnitureTypeRepository.countFindMany(query)

		const result = query.pagination
			? {
					totalCount: furnitureTypesCount,
					pagesCount: Math.ceil(furnitureTypesCount / query.pageSize),
					pageSize: furnitureTypes.length,
					data: furnitureTypes,
				}
			: { data: furnitureTypes }

		return createResponse({ data: result, success: { messages: ['find many success'] } })
	}

	async findOne(query: FurnitureTypeFindOneRequest) {
		const staff = await this.furnitureTypeRepository.findOne(query)

		if (!staff) {
			throw new BadRequestException('furniture type not found')
		}
		return createResponse({ data: { ...staff }, success: { messages: ['find one success'] } })
	}

	async getMany(query: FurnitureTypeGetManyRequest) {
		const furnitureTypes = await this.furnitureTypeRepository.getMany(query)
		const furnitureTypesCount = await this.furnitureTypeRepository.countGetMany(query)

		const result = query.pagination
			? {
					pagesCount: Math.ceil(furnitureTypesCount / query.pageSize),
					pageSize: furnitureTypes.length,
					data: furnitureTypes,
				}
			: { data: furnitureTypes }

		return createResponse({ data: result, success: { messages: ['get many success'] } })
	}

	async getOne(query: FurnitureTypeGetOneRequest) {
		const staff = await this.furnitureTypeRepository.getOne(query)

		if (!staff) {
			throw new BadRequestException('furniture type not found')
		}

		return createResponse({ data: staff, success: { messages: ['get one success'] } })
	}

	async createOne(body: FurnitureTypeCreateOneRequest) {
		const candidate = await this.furnitureTypeRepository.getOne({ name: body.name })
		if (candidate) {
			throw new BadRequestException('name already exists')
		}

		await this.furnitureTypeRepository.createOne({ ...body })

		return createResponse({ data: null, success: { messages: ['create one success'] } })
	}

	async updateOne(query: FurnitureTypeGetOneRequest, body: FurnitureTypeUpdateOneRequest) {
		await this.getOne(query)

		if (body.name) {
			const candidate = await this.furnitureTypeRepository.getOne({ name: body.name })
			if (candidate && candidate.id !== query.id) {
				throw new BadRequestException('name already exists')
			}
		}

		await this.furnitureTypeRepository.updateOne(query, { ...body })

		return createResponse({ data: null, success: { messages: ['update one success'] } })
	}

	async deleteOne(query: FurnitureTypeDeleteOneRequest) {
		await this.getOne(query)
		if (query.method === DeleteMethodEnum.hard) {
			await this.furnitureTypeRepository.deleteOne(query)
		} else {
			await this.furnitureTypeRepository.updateOne(query, { deletedAt: new Date() })
		}
		return createResponse({ data: null, success: { messages: ['delete one success'] } })
	}
}
