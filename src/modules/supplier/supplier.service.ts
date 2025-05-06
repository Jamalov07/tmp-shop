import { BadRequestException, Injectable } from '@nestjs/common'
import { SupplierRepository } from './supplier.repository'
import { createResponse, DeleteMethodEnum } from '@common'
import {
	SupplierGetOneRequest,
	SupplierCreateOneRequest,
	SupplierUpdateOneRequest,
	SupplierGetManyRequest,
	SupplierFindManyRequest,
	SupplierFindOneRequest,
	SupplierDeleteOneRequest,
} from './interfaces'

@Injectable()
export class SupplierService {
	private readonly supplierRepository: SupplierRepository

	constructor(supplierRepository: SupplierRepository) {
		this.supplierRepository = supplierRepository
	}

	async findMany(query: SupplierFindManyRequest) {
		const suppliers = await this.supplierRepository.findMany({ ...query })
		const suppliersCount = await this.supplierRepository.countFindMany(query)

		const result = query.pagination
			? {
					totalCount: suppliersCount,
					pagesCount: Math.ceil(suppliersCount / query.pageSize),
					pageSize: suppliers.length,
					data: suppliers,
				}
			: { data: suppliers }

		return createResponse({ data: result, success: { messages: ['find many success'] } })
	}

	async findOne(query: SupplierFindOneRequest) {
		const supplier = await this.supplierRepository.findOne(query)

		if (!supplier) {
			throw new BadRequestException('supplier not found')
		}

		return createResponse({
			data: { ...supplier },
			success: { messages: ['find one success'] },
		})
	}

	async getMany(query: SupplierGetManyRequest) {
		const suppliers = await this.supplierRepository.getMany(query)
		const suppliersCount = await this.supplierRepository.countGetMany(query)

		const result = query.pagination
			? {
					pagesCount: Math.ceil(suppliersCount / query.pageSize),
					pageSize: suppliers.length,
					data: suppliers,
				}
			: { data: suppliers }

		return createResponse({ data: result, success: { messages: ['get many success'] } })
	}

	async getOne(query: SupplierGetOneRequest) {
		const supplier = await this.supplierRepository.getOne(query)

		if (!supplier) {
			throw new BadRequestException('supplier not found')
		}

		return createResponse({ data: supplier, success: { messages: ['get one success'] } })
	}

	async createOne(body: SupplierCreateOneRequest) {
		await this.supplierRepository.createOne({ ...body })

		return createResponse({ data: null, success: { messages: ['create one success'] } })
	}

	async updateOne(query: SupplierGetOneRequest, body: SupplierUpdateOneRequest) {
		await this.getOne(query)

		await this.supplierRepository.updateOne(query, { ...body })

		return createResponse({ data: null, success: { messages: ['update one success'] } })
	}

	async deleteOne(query: SupplierDeleteOneRequest) {
		await this.getOne(query)
		if (query.method === DeleteMethodEnum.hard) {
			await this.supplierRepository.deleteOne(query)
		} else {
			await this.supplierRepository.updateOne(query, { deletedAt: new Date() })
		}
		return createResponse({ data: null, success: { messages: ['delete one success'] } })
	}
}
