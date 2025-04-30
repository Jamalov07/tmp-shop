import { BadRequestException, Injectable } from '@nestjs/common'
import { PartnerRepository } from './partner.repository'
import * as bcrypt from 'bcryptjs'
import { createResponse, DeleteMethodEnum } from '@common'
import {
	PartnerGetOneRequest,
	PartnerCreateOneRequest,
	PartnerUpdateOneRequest,
	PartnerGetManyRequest,
	PartnerFindManyRequest,
	PartnerFindOneRequest,
	PartnerDeleteOneRequest,
} from './interfaces'

@Injectable()
export class PartnerService {
	private readonly partnerRepository: PartnerRepository

	constructor(partnerRepository: PartnerRepository) {
		this.partnerRepository = partnerRepository
	}

	async findMany(query: PartnerFindManyRequest) {
		const partners = await this.partnerRepository.findMany(query)
		const partnersCount = await this.partnerRepository.countFindMany(query)

		const result = query.pagination
			? {
					totalCount: partnersCount,
					pagesCount: Math.ceil(partnersCount / query.pageSize),
					pageSize: partners.length,
					data: partners,
				}
			: { data: partners }

		return createResponse({ data: result, success: { messages: ['find many success'] } })
	}

	async findManyProvider(query: PartnerFindManyRequest) {
		const partners = await this.partnerRepository.findManyProvider(query)
		const partnersCount = await this.partnerRepository.countFindManyProvider(query)

		const result = query.pagination
			? {
					totalCount: partnersCount,
					pagesCount: Math.ceil(partnersCount / query.pageSize),
					pageSize: partners.length,
					data: partners,
				}
			: { data: partners }

		return createResponse({ data: result, success: { messages: ['find many success'] } })
	}

	async findOne(query: PartnerFindOneRequest) {
		const partner = await this.partnerRepository.findOne(query)

		if (!partner) {
			throw new BadRequestException('partner not found')
		}

		return createResponse({ data: { ...partner, actionIds: partner.actions.map((a) => a.id) }, success: { messages: ['find one success'] } })
	}

	async getMany(query: PartnerGetManyRequest) {
		const partners = await this.partnerRepository.getMany(query)
		const partnersCount = await this.partnerRepository.countGetMany(query)

		const result = query.pagination
			? {
					pagesCount: Math.ceil(partnersCount / query.pageSize),
					pageSize: partners.length,
					data: partners,
				}
			: { data: partners }

		return createResponse({ data: result, success: { messages: ['get many success'] } })
	}

	async getOne(query: PartnerGetOneRequest) {
		const partner = await this.partnerRepository.getOne(query)

		if (!partner) {
			throw new BadRequestException('partner not found')
		}

		return createResponse({ data: partner, success: { messages: ['get one success'] } })
	}

	async createOne(body: PartnerCreateOneRequest) {
		const candidate = await this.partnerRepository.getOne({ phone: body.phone })

		if (candidate) {
			throw new BadRequestException('phone already exists')
		}

		const password = await bcrypt.hash(body.password, 7)

		await this.partnerRepository.createOne({ ...body, password: password })

		return createResponse({ data: null, success: { messages: ['create one success'] } })
	}

	async updateOne(query: PartnerGetOneRequest, body: PartnerUpdateOneRequest) {
		await this.getOne(query)

		if (body.phone) {
			const candidate = await this.partnerRepository.getOne({ phone: body.phone })
			if (candidate && candidate.id !== query.id) {
				throw new BadRequestException('phone already exists')
			}
		}

		await this.partnerRepository.updateOne(query, { ...body, password: body.password ? await bcrypt.hash(body.password, 7) : undefined })

		return createResponse({ data: null, success: { messages: ['update one success'] } })
	}

	async deleteOne(query: PartnerDeleteOneRequest) {
		await this.getOne(query)
		if (query.method === DeleteMethodEnum.hard) {
			await this.partnerRepository.deleteOne(query)
		} else {
			await this.partnerRepository.updateOne(query, { deletedAt: new Date() })
		}
		return createResponse({ data: null, success: { messages: ['delete one success'] } })
	}
}
