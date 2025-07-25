import { BadRequestException, Injectable } from '@nestjs/common'
import { ClientRepository } from './client.repository'
import { createResponse, DebtTypeEnum, DeleteMethodEnum } from '@common'
import {
	ClientGetOneRequest,
	ClientCreateOneRequest,
	ClientUpdateOneRequest,
	ClientGetManyRequest,
	ClientFindManyRequest,
	ClientFindOneRequest,
	ClientDeleteOneRequest,
	ClientDeed,
} from './interfaces'
import { Decimal } from '@prisma/client/runtime/library'
import { ExcelService } from '../shared'
import { Response } from 'express'

@Injectable()
export class ClientService {
	private readonly clientRepository: ClientRepository
	private readonly excelService: ExcelService

	constructor(clientRepository: ClientRepository, excelService: ExcelService) {
		this.clientRepository = clientRepository
		this.excelService = excelService
	}

	async findMany(query: ClientFindManyRequest) {
		const clients = await this.clientRepository.findMany({ ...query, pagination: false })
		// const clientsCount = await this.clientRepository.countFindMany(query)

		const mappedClients = clients.map((c) => {
			const sellingPayment = c.sellings.reduce((acc, sel) => {
				return acc.plus(sel.totalPrice).minus(sel.payment.total)
			}, new Decimal(0))

			c.returnings.map((returning) => {
				c.balance = c.balance.plus(returning.payment.fromBalance)
			})

			return {
				id: c.id,
				fullname: c.fullname,
				telegram: c.telegram,
				actions: c.actions,
				createdAt: c.createdAt,
				phone: c.phone,
				debt: sellingPayment.minus(c.balance),
				lastSellingDate: c.sellings?.length ? c.sellings[0].date : null,
			}
		})

		const filteredClients = mappedClients.filter((s) => {
			if (query.debtType && query.debtValue !== undefined) {
				const value = new Decimal(query.debtValue)
				switch (query.debtType) {
					case DebtTypeEnum.gt:
						return s.debt.gt(value)
					case DebtTypeEnum.lt:
						return s.debt.lt(value)
					case DebtTypeEnum.eq:
						return s.debt.eq(value)
					default:
						return true
				}
			}
			return true
		})

		const paginatedClients = query.pagination ? filteredClients.slice((query.pageNumber - 1) * query.pageSize, query.pageNumber * query.pageSize) : filteredClients

		const result = query.pagination
			? {
					totalCount: filteredClients.length,
					pagesCount: Math.ceil(filteredClients.length / query.pageSize),
					pageSize: paginatedClients.length,
					data: paginatedClients,
				}
			: { data: mappedClients }

		return createResponse({ data: result, success: { messages: ['find many success'] } })
	}

	async excelDownloadMany(res: Response, query: ClientFindManyRequest) {
		return this.excelService.clientDownloadMany(res, query)
	}

	async findOne(query: ClientFindOneRequest) {
		const deedStartDate = query.deedStartDate ? new Date(new Date(query.deedStartDate).setHours(0, 0, 0, 0)) : undefined
		const deedEndDate = query.deedEndDate ? new Date(new Date(query.deedEndDate).setHours(23, 59, 59, 999)) : undefined

		const client = await this.clientRepository.findOne(query)

		if (!client) {
			throw new BadRequestException('client not found')
		}
		const deeds: ClientDeed[] = []
		let totalDebit: Decimal = new Decimal(0)
		let totalCredit: Decimal = new Decimal(0)

		let payment = client.payments.reduce((acc, curr) => {
			if ((!deedStartDate || curr.createdAt >= deedStartDate) && (!deedEndDate || curr.createdAt <= deedEndDate)) {
				deeds.push({ type: 'credit', action: 'payment', value: curr.total, date: curr.createdAt, description: curr.description })
				totalCredit = totalCredit.plus(curr.total)
			}

			return acc.plus(curr.total)
		}, new Decimal(0))

		const sellingPayment = client.sellings.reduce((acc, sel) => {
			if ((!deedStartDate || sel.date >= deedStartDate) && (!deedEndDate || sel.date <= deedEndDate)) {
				deeds.push({ type: 'debit', action: 'selling', value: sel.totalPrice, date: sel.date, description: '' })
				totalDebit = totalDebit.plus(sel.totalPrice)
			}

			if ((!deedStartDate || sel.payment.createdAt >= deedStartDate) && (!deedEndDate || sel.payment.createdAt <= deedEndDate)) {
				deeds.push({ type: 'credit', action: 'payment', value: sel.payment.total, date: sel.payment.createdAt, description: sel.payment.description })
				totalCredit = totalCredit.plus(sel.payment.total)
			}

			return acc.plus(sel.totalPrice).minus(sel.payment.total)
		}, new Decimal(0))

		client.returnings.map((returning) => {
			if ((!deedStartDate || returning.payment.createdAt >= deedStartDate) && (!deedEndDate || returning.payment.createdAt <= deedEndDate)) {
				deeds.push({ type: 'credit', action: 'returning', value: returning.payment.fromBalance, date: returning.payment.createdAt, description: returning.payment.description })
				totalCredit = totalCredit.plus(returning.payment.fromBalance)
				payment = payment.plus(returning.payment.fromBalance)
			}
		})

		const filteredDeeds = deeds.filter((d) => !d.value.equals(0)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

		return createResponse({
			data: {
				id: client.id,
				fullname: client.fullname,
				phone: client.phone,
				createdAt: client.createdAt,
				updatedAt: client.updatedAt,
				deletedAt: client.deletedAt,
				actionIds: client.actions.map((a) => a.id),
				debt: sellingPayment.minus(payment),
				deedInfo: {
					totalDebit: totalDebit,
					totalCredit: totalCredit,
					debt: totalDebit.minus(totalCredit),
					deeds: filteredDeeds,
				},
				telegram: client.telegram,
				lastArrivalDate: client.sellings?.length ? client.sellings[0].date : null,
			},
			success: { messages: ['find one success'] },
		})
	}

	async excelDownloadOne(res: Response, query: ClientFindOneRequest) {
		return this.excelService.clientDeedDownloadOne(res, query)
	}

	async excelWithProductDownloadOne(res: Response, query: ClientFindOneRequest) {
		return this.excelService.clientDeedWithProductDownloadOne(res, query)
	}

	async getMany(query: ClientGetManyRequest) {
		const clients = await this.clientRepository.getMany(query)
		const clientsCount = await this.clientRepository.countGetMany(query)

		const result = query.pagination
			? {
					pagesCount: Math.ceil(clientsCount / query.pageSize),
					pageSize: clients.length,
					data: clients,
				}
			: { data: clients }

		return createResponse({ data: result, success: { messages: ['get many success'] } })
	}

	async getOne(query: ClientGetOneRequest) {
		const client = await this.clientRepository.getOne(query)

		if (!client) {
			throw new BadRequestException('client not found')
		}

		return createResponse({ data: client, success: { messages: ['get one success'] } })
	}

	async createOne(body: ClientCreateOneRequest) {
		const candidate = await this.clientRepository.getOne({ phone: body.phone })
		if (candidate) {
			throw new BadRequestException('phone already exists')
		}

		const client = await this.clientRepository.createOne({ ...body })

		return createResponse({ data: client, success: { messages: ['create one success'] } })
	}

	async updateOne(query: ClientGetOneRequest, body: ClientUpdateOneRequest) {
		await this.getOne(query)

		if (body.phone) {
			const candidate = await this.clientRepository.getOne({ phone: body.phone })
			if (candidate && candidate.id !== query.id) {
				throw new BadRequestException('phone already exists')
			}
		}

		await this.clientRepository.updateOne(query, { ...body })

		return createResponse({ data: null, success: { messages: ['update one success'] } })
	}

	async deleteOne(query: ClientDeleteOneRequest) {
		await this.getOne(query)
		if (query.method === DeleteMethodEnum.hard) {
			await this.clientRepository.deleteOne(query)
		} else {
			await this.clientRepository.updateOne(query, { deletedAt: new Date() })
		}
		return createResponse({ data: null, success: { messages: ['delete one success'] } })
	}
}
