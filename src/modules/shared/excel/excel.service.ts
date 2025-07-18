import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma'
import * as ExcelJS from 'exceljs'
import { Response } from 'express'
import * as fs from 'fs'
import * as path from 'path'
import { SellingFindManyRequest, SellingFindOneRequest } from '../../selling'
import { ArrivalFindManyRequest, ArrivalFindOneRequest } from '../../arrival'
import { ReturningFindManyRequest, ReturningFindOneRequest } from '../../returning'
import { Decimal } from '@prisma/client/runtime/library'
import { ClientPaymentFindManyRequest } from '../../client-payment'
import { SellingStatusEnum, ServiceTypeEnum, UserTypeEnum } from '@prisma/client'
import { ClientDeed, ClientFindManyRequest, ClientFindOneRequest } from '../../client'
import { DebtTypeEnum } from '../../../common'
import { StaffPaymentFindManyRequest } from '../../staff-payment'
@Injectable()
export class ExcelService {
	private readonly prisma: PrismaService

	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async sellingDownloadMany(res: Response, query: SellingFindManyRequest) {
		const startDate = query.startDate ? new Date(new Date(query.startDate).setHours(0, 0, 0, 0)) : undefined
		const endDate = query.endDate ? new Date(new Date(query.endDate).setHours(23, 59, 59, 999)) : undefined

		const sellingList = await this.prisma.sellingModel.findMany({
			where: {
				deletedAt: null,
				status: SellingStatusEnum.accepted,
				date: { ...(startDate && { gte: startDate }), ...(endDate && { lte: endDate }) },
			},
			include: {
				client: true,
				staff: true,
				products: { include: { product: true } },
				payment: true,
			},
			orderBy: { date: 'desc' },
		})

		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Sotuvlar')

		worksheet.columns = [
			{ key: 'no', width: 5 },
			{ key: 'client', width: 35 },
			{ key: 'phone', width: 20 },
			{ key: 'summa', width: 15 },
			{ key: 'staff', width: 25 },
			{ key: 'info', width: 40 },
			{ key: 'debt', width: 15 },
			{ key: 'date', width: 30 },
		]

		let total = 0
		worksheet.insertRow(1, [`Общая сумма: 0`])
		worksheet.mergeCells('A1:H1')
		const cellA1 = worksheet.getCell('A1')
		cellA1.font = { bold: true }
		cellA1.border = {
			top: { style: 'thin', color: { argb: 'FF000000' } },
			left: { style: 'thin', color: { argb: 'FF000000' } },
			bottom: { style: 'thin', color: { argb: 'FF000000' } },
			right: { style: 'thin', color: { argb: 'FF000000' } },
		}
		worksheet.insertRow(2, [])

		const headers = ['№', 'Клиент', 'Тел', 'Сумма', 'Продавец', 'Информация', 'Долг', 'Дата продажи']
		worksheet.insertRow(3, headers)
		worksheet.getRow(3).eachCell((cell) => {
			cell.font = { bold: true }
			cell.alignment = { vertical: 'middle', horizontal: 'center' }
			cell.border = {
				top: { style: 'thin', color: { argb: 'FF000000' } },
				left: { style: 'thin', color: { argb: 'FF000000' } },
				bottom: { style: 'thin', color: { argb: 'FF000000' } },
				right: { style: 'thin', color: { argb: 'FF000000' } },
			}
		})

		sellingList.forEach((item, index) => {
			const totalSum = item.products.reduce((sum, p) => sum + p.price.toNumber() * p.count, 0)
			const paidSum =
				(item.payment?.cash?.toNumber() ?? 0) + (item.payment?.card?.toNumber() ?? 0) + (item.payment?.transfer?.toNumber() ?? 0) + (item.payment?.other?.toNumber() ?? 0)

			const debt = totalSum - paidSum
			total += totalSum

			const row = worksheet.addRow({
				no: index + 1,
				client: item.client.fullname,
				phone: item.client.phone,
				summa: totalSum,
				staff: item.staff.fullname,
				info: item.payment?.description || '',
				debt: debt,
				date: item.date.toLocaleString('ru-RU'),
			})

			row.eachCell((cell) => {
				cell.alignment = { vertical: 'middle', horizontal: 'center' }
				cell.border = {
					top: { style: 'thin', color: { argb: 'FF000000' } },
					left: { style: 'thin', color: { argb: 'FF000000' } },
					bottom: { style: 'thin', color: { argb: 'FF000000' } },
					right: { style: 'thin', color: { argb: 'FF000000' } },
				}
			})
		})

		cellA1.value = `Общая сумма: ${total}`

		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
		res.setHeader('Content-Disposition', 'attachment; filename="selling-report.xlsx"')
		await workbook.xlsx.write(res)
		res.end()
	}

	async sellingDownloadOne(res: Response, query: SellingFindOneRequest) {
		const selling = await this.prisma.sellingModel.findUnique({
			where: { id: query.id },
			include: {
				client: true,
				products: { include: { product: true } },
				payment: true,
			},
		})

		if (!selling) {
			res.status(404).send('Sotuv topilmadi')
			return
		}

		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Chek')

		// A1: Xaridor
		worksheet.mergeCells('A1:B1')
		const cellA1 = worksheet.getCell('A1')
		cellA1.value = `Xaridor: ${selling.client.fullname}`
		cellA1.font = { bold: true }
		cellA1.border = {
			top: { style: 'thin', color: { argb: 'FF000000' } },
			left: { style: 'thin', color: { argb: 'FF000000' } },
			bottom: { style: 'thin', color: { argb: 'FF000000' } },
			right: { style: 'thin', color: { argb: 'FF000000' } },
		}

		// D1: Telefon
		worksheet.mergeCells('D1:E1')
		const cellD1 = worksheet.getCell('D1')
		cellD1.value = `Telefon: ${selling.client.phone}`
		cellD1.font = { bold: true }
		cellD1.border = {
			top: { style: 'thin', color: { argb: 'FF000000' } },
			left: { style: 'thin', color: { argb: 'FF000000' } },
			bottom: { style: 'thin', color: { argb: 'FF000000' } },
			right: { style: 'thin', color: { argb: 'FF000000' } },
		}

		// 2-qator: Sarlavhalar
		const headerRow = worksheet.addRow(['№', 'Махсулот номи', '√', 'Сони', 'Нархи', 'Суммаси'])
		headerRow.eachCell((cell) => {
			cell.font = { bold: true }
			cell.alignment = { vertical: 'middle', horizontal: 'center' }
			cell.border = {
				top: { style: 'thin', color: { argb: 'FF000000' } },
				left: { style: 'thin', color: { argb: 'FF000000' } },
				bottom: { style: 'thin', color: { argb: 'FF000000' } },
				right: { style: 'thin', color: { argb: 'FF000000' } },
			}
		})

		// Mahsulotlar
		let totalSum = 0
		selling.products.forEach((item, index) => {
			const count = item.count
			const price = item.price.toNumber()
			const sum = count * price
			totalSum += sum

			const row = worksheet.addRow([index + 1, item.product.name, '', count, price, sum])
			row.eachCell((cell) => {
				cell.alignment = { vertical: 'middle', horizontal: 'center' }
				cell.border = {
					top: { style: 'thin', color: { argb: 'FF000000' } },
					left: { style: 'thin', color: { argb: 'FF000000' } },
					bottom: { style: 'thin', color: { argb: 'FF000000' } },
					right: { style: 'thin', color: { argb: 'FF000000' } },
				}
			})
		})

		// Bo'sh qator
		worksheet.addRow([])

		// To‘lovlar
		const paidSum =
			(selling.payment?.cash?.toNumber() ?? 0) +
			(selling.payment?.card?.toNumber() ?? 0) +
			(selling.payment?.transfer?.toNumber() ?? 0) +
			(selling.payment?.other?.toNumber() ?? 0) +
			(selling.payment?.fromBalance?.toNumber() ?? 0)

		const totalRow = worksheet.addRow(['', '', '', '', 'Жами сумма:', totalSum])
		const paidRow = worksheet.addRow(['', '', '', '', 'Тўлов қилинди:', paidSum])

		const totalAndPaid = [totalRow, paidRow]

		totalAndPaid.forEach((row) => {
			row.eachCell((cell) => {
				cell.font = { bold: true }
				cell.alignment = { vertical: 'middle', horizontal: 'center' }
				cell.border = {
					top: { style: 'thin', color: { argb: 'FF000000' } },
					left: { style: 'thin', color: { argb: 'FF000000' } },
					bottom: { style: 'thin', color: { argb: 'FF000000' } },
					right: { style: 'thin', color: { argb: 'FF000000' } },
				}
			})
		})

		// Ustun o‘lchamlari
		worksheet.columns = [
			{ key: 'no', width: 5 },
			{ key: 'name', width: 40 },
			{ key: 'check', width: 10 },
			{ key: 'count', width: 20 },
			{ key: 'price', width: 25 },
			{ key: 'total', width: 25 },
		]

		// Javob
		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
		res.setHeader('Content-Disposition', `attachment; filename="selling-${selling.id}.xlsx"`)

		await workbook.xlsx.write(res)
		res.end()
	}

	async arrivalDownloadMany(res: Response, query: ArrivalFindManyRequest) {
		const startDate = query.startDate ? new Date(new Date(query.startDate).setHours(0, 0, 0, 0)) : undefined
		const endDate = query.endDate ? new Date(new Date(query.endDate).setHours(23, 59, 59, 999)) : undefined

		const arrivalList = await this.prisma.arrivalModel.findMany({
			where: {
				deletedAt: null,
				createdAt: {
					...(startDate && { gte: startDate }),
					...(endDate && { lte: endDate }),
				},
			},
			include: {
				supplier: true,
				staff: true,
				products: {
					select: {
						price: true,
						count: true,
						cost: true,
					},
				},
				payment: true,
			},
			orderBy: { createdAt: 'desc' },
		})

		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Приходы')

		worksheet.columns = [
			{ key: 'no', width: 5 },
			{ key: 'supplier', width: 35 },
			{ key: 'summa', width: 15 },
			{ key: 'staff', width: 25 },
			{ key: 'info', width: 40 },
			{ key: 'date', width: 30 },
		]

		let total = 0

		// 1-qator: Общая сумма
		worksheet.insertRow(1, [`Общая сумма: 0`])
		worksheet.mergeCells('A1:F1')
		const cellA1 = worksheet.getCell('A1')
		cellA1.font = { bold: true }
		cellA1.border = {
			top: { style: 'thin', color: { argb: 'FF000000' } },
			left: { style: 'thin', color: { argb: 'FF000000' } },
			bottom: { style: 'thin', color: { argb: 'FF000000' } },
			right: { style: 'thin', color: { argb: 'FF000000' } },
		}

		// 2-qator: bo'sh
		worksheet.insertRow(2, [])

		// 3-qator: Header
		const headers = ['№', 'Поставщик', 'Сумма', 'Кем оприходован', 'Информация', 'Дата прихода']
		worksheet.insertRow(3, headers)
		worksheet.getRow(3).eachCell((cell) => {
			cell.font = { bold: true }
			cell.alignment = { vertical: 'middle', horizontal: 'center' }
			cell.border = {
				top: { style: 'thin', color: { argb: 'FF000000' } },
				left: { style: 'thin', color: { argb: 'FF000000' } },
				bottom: { style: 'thin', color: { argb: 'FF000000' } },
				right: { style: 'thin', color: { argb: 'FF000000' } },
			}
		})

		// Ma'lumotlar
		arrivalList.forEach((item, index) => {
			const totalSum = item.products.reduce((sum, p) => sum + p.cost.toNumber() * p.count, 0)
			total += totalSum

			const row = worksheet.addRow({
				no: index + 1,
				supplier: item.supplier.fullname,
				summa: totalSum,
				staff: item.staff.phone,
				info: item.payment?.description || '',
				date: item.createdAt.toLocaleString('ru-RU'),
			})

			row.eachCell((cell) => {
				cell.alignment = { vertical: 'middle', horizontal: 'center' }
				cell.border = {
					top: { style: 'thin', color: { argb: 'FF000000' } },
					left: { style: 'thin', color: { argb: 'FF000000' } },
					bottom: { style: 'thin', color: { argb: 'FF000000' } },
					right: { style: 'thin', color: { argb: 'FF000000' } },
				}
			})
		})

		// Общая сумма ni yangilash
		cellA1.value = `Общая сумма: ${total}`

		// Excelga yozish
		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
		res.setHeader('Content-Disposition', 'attachment; filename="arrival-report.xlsx"')

		await workbook.xlsx.write(res)
		res.end()
	}

	async arrivalDownloadOne(res: Response, query: ArrivalFindOneRequest) {
		const arrival = await this.prisma.arrivalModel.findUnique({
			where: { id: query.id, deletedAt: null },
			include: {
				supplier: true,
				staff: true,
				products: {
					select: {
						price: true,
						count: true,
						cost: true,
						product: { select: { name: true } },
					},
				},
				payment: true,
			},
		})

		if (!arrival) {
			return res.status(404).json({ message: 'Arrival not found' })
		}

		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Приходы')

		// Ustun o'lchamlari
		worksheet.columns = [
			{ key: 'no', width: 5 },
			{ key: 'product', width: 35 },
			{ key: 'quantity', width: 15 },
			{ key: 'price', width: 15 },
			{ key: 'cost', width: 15 },
		]

		// 1-qator: Приход от
		const arrivalDateRow = worksheet.addRow([`Приход от: ${arrival.createdAt.toLocaleString('ru-RU')}`])
		worksheet.mergeCells(`A${arrivalDateRow.number}:E${arrivalDateRow.number}`)
		arrivalDateRow.getCell(1).font = { bold: true }
		arrivalDateRow.getCell(1).border = borderAll()

		// 2-qator: Поставщик
		const supplierRow = worksheet.addRow([`Поставщик: ${arrival.supplier.fullname}`])
		worksheet.mergeCells(`A${supplierRow.number}:E${supplierRow.number}`)
		supplierRow.getCell(1).font = { bold: true }
		supplierRow.getCell(1).border = borderAll()

		// 3-qator: bo'sh
		worksheet.addRow([])

		// 4-qator: Header
		const headerTitles = ['№', 'Товар', 'Количество', 'Цена', 'Стоимость']
		const headerRow = worksheet.addRow(headerTitles)
		headerRow.eachCell((cell) => {
			cell.font = { bold: true }
			cell.alignment = { vertical: 'middle', horizontal: 'center' }
			cell.border = borderAll()
		})

		// Mahsulotlar
		arrival.products.forEach((product, index) => {
			const row = worksheet.addRow([index + 1, product.product.name, product.count, product.price.toNumber(), product.cost.toNumber() * product.count])
			row.eachCell((cell) => {
				cell.alignment = { vertical: 'middle', horizontal: 'center' }
				cell.border = borderAll()
			})
		})

		// Bo'sh qator
		worksheet.addRow([])

		// Итого qatori
		const totalCost = arrival.products.reduce((sum, p) => sum + p.cost.toNumber() * p.count, 0)
		const totalRow = worksheet.addRow(['', 'Итого', '', '', totalCost])
		totalRow.eachCell((cell) => {
			cell.font = { bold: true }
			cell.alignment = { vertical: 'middle', horizontal: 'center' }
			cell.border = borderAll()
		})

		// Excel javobi
		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
		res.setHeader('Content-Disposition', 'attachment; filename="arrival-report-one.xlsx"')

		await workbook.xlsx.write(res)
		res.end()

		// Border helper funksiyasi
		function borderAll(): Partial<ExcelJS.Borders> {
			return {
				top: { style: 'thin', color: { argb: 'FF000000' } },
				left: { style: 'thin', color: { argb: 'FF000000' } },
				bottom: { style: 'thin', color: { argb: 'FF000000' } },
				right: { style: 'thin', color: { argb: 'FF000000' } },
			}
		}
	}

	async returningDownloadMany(res: Response, query: ReturningFindManyRequest) {
		const startDate = query.startDate ? new Date(new Date(query.startDate).setHours(0, 0, 0, 0)) : undefined
		const endDate = query.endDate ? new Date(new Date(query.endDate).setHours(23, 59, 59, 999)) : undefined

		const returningList = await this.prisma.returningModel.findMany({
			where: {
				status: query.status,
				clientId: query.clientId,
				OR: [{ client: { fullname: { contains: query.search, mode: 'insensitive' } } }, { client: { phone: { contains: query.search, mode: 'insensitive' } } }],
				date: {
					...(startDate && { gte: startDate }),
					...(endDate && { lte: endDate }),
				},
			},
			select: {
				date: true,
				client: { select: { fullname: true, phone: true } },
				staff: { select: { phone: true } },
				payment: { select: { cash: true, fromBalance: true, description: true } },
			},
			orderBy: { date: 'desc' },
		})

		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Возвраты')

		worksheet.columns = [
			{ key: 'no', width: 5 },
			{ key: 'client', width: 45 },
			{ key: 'cash', width: 15 },
			{ key: 'balance', width: 15 },
			{ key: 'staff', width: 20 },
			{ key: 'info', width: 25 },
			{ key: 'date', width: 20 },
		]

		let total = new Decimal(0)

		// 1-qator: Общая сумма (dynamic, keyin yangilanadi)
		worksheet.insertRow(1, [`Общая сумма: 0`])
		worksheet.mergeCells('A1:F1')
		const cellA1 = worksheet.getCell('A1')
		cellA1.font = { bold: true }
		cellA1.alignment = { vertical: 'middle', horizontal: 'left' }
		cellA1.border = {
			top: { style: 'thin', color: { argb: 'FF000000' } },
			left: { style: 'thin', color: { argb: 'FF000000' } },
			bottom: { style: 'thin', color: { argb: 'FF000000' } },
			right: { style: 'thin', color: { argb: 'FF000000' } },
		}

		// 2-qator: bo‘sh qator
		worksheet.insertRow(2, [])

		// 3-qator: sarlavhalar
		const headers = ['№', 'Клиент', 'Наличные', 'Из баланса', 'Кем отправован', 'Информация', 'Дата прихода']
		worksheet.insertRow(3, headers)

		worksheet.getRow(3).eachCell((cell) => {
			cell.font = { bold: true }
			cell.alignment = { vertical: 'middle', horizontal: 'center' }
			cell.border = {
				top: { style: 'thin', color: { argb: 'FF000000' } },
				left: { style: 'thin', color: { argb: 'FF000000' } },
				bottom: { style: 'thin', color: { argb: 'FF000000' } },
				right: { style: 'thin', color: { argb: 'FF000000' } },
			}
		})

		// Ma'lumotlarni to‘ldirish
		returningList.forEach((item, index) => {
			const sum = item.payment?.cash.plus(item.payment?.fromBalance ?? 0) ?? new Decimal(0)
			total = total.plus(sum)

			const row = worksheet.addRow({
				no: index + 1,
				client: `${item.client.fullname} - ${item.client.phone}`,
				cash: item.payment.cash.toFixed(2),
				balance: item.payment.fromBalance.toFixed(2),
				staff: item.staff?.phone || '',
				info: item.payment?.description || '',
				date: item.date.toLocaleString('ru-RU'),
			})

			row.eachCell((cell) => {
				cell.alignment = { vertical: 'middle', horizontal: 'center' }
				cell.border = {
					top: { style: 'thin', color: { argb: 'FF000000' } },
					left: { style: 'thin', color: { argb: 'FF000000' } },
					bottom: { style: 'thin', color: { argb: 'FF000000' } },
					right: { style: 'thin', color: { argb: 'FF000000' } },
				}
			})
		})

		// Общая сумма yangilash
		cellA1.value = `Общая сумма: ${total.toFixed(2)}`

		// Excel response
		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
		res.setHeader('Content-Disposition', 'attachment; filename="returnings-report.xlsx"')

		await workbook.xlsx.write(res)
		res.end()
	}

	async returningDownloadOne(res: Response, query: ReturningFindOneRequest) {
		const returning = await this.prisma.returningModel.findUnique({
			where: { id: query.id },
			select: {
				date: true,
				client: { select: { fullname: true } },
				products: {
					select: {
						count: true,
						price: true,
						product: { select: { name: true } },
					},
					orderBy: { createdAt: 'asc' },
				},
			},
		})

		if (!returning) {
			return res.status(404).json({ message: 'Returning not found' })
		}

		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Возврат')

		// Ustun o‘lchamlari
		worksheet.columns = [
			{ key: 'no', width: 5 },
			{ key: 'product', width: 40 },
			{ key: 'quantity', width: 15 },
			{ key: 'price', width: 12 },
			{ key: 'cost', width: 15 },
		]

		// 1-qator: Приход от: ...
		const formattedDate = formatDate(returning.date)
		const dateRow = worksheet.addRow([`Приход от: ${formattedDate}`])
		worksheet.mergeCells(`A${dateRow.number}:E${dateRow.number}`)
		const dateCell = dateRow.getCell(1)
		dateCell.font = { bold: true }
		dateCell.alignment = { vertical: 'middle', horizontal: 'left' }
		dateCell.border = borderAll()

		// 2-qator: Клиент: ...
		const clientRow = worksheet.addRow([`Клиент: ${returning.client.fullname}`])
		worksheet.mergeCells(`A${clientRow.number}:E${clientRow.number}`)
		const clientCell = clientRow.getCell(1)
		clientCell.font = { bold: true }
		clientCell.alignment = { vertical: 'middle', horizontal: 'left' }
		clientCell.border = borderAll()

		// 3-qator: bo‘sh
		worksheet.addRow([])

		// 4-qator: Header
		const headerTitles = ['№', 'Товар', 'Количество', 'Цена', 'Стоимость']
		const headerRow = worksheet.addRow(headerTitles)
		headerRow.eachCell((cell) => {
			cell.font = { bold: true }
			cell.alignment = { vertical: 'middle', horizontal: 'center' }
			cell.border = borderAll()
		})

		// Mahsulotlar
		let total = 0

		returning.products.forEach((item, index) => {
			const count = item.count
			const price = item.price
			const cost = count * price.toNumber()
			total += cost

			const row = worksheet.addRow([index + 1, item.product.name, count, price.toNumber(), cost])
			row.eachCell((cell) => {
				cell.alignment = { vertical: 'middle', horizontal: 'center' }
				cell.border = borderAll()
			})
		})

		// Bo‘sh qator
		worksheet.addRow([])

		// Итого
		const totalRow = worksheet.addRow(['', 'Итого', '', '', total])
		totalRow.eachCell((cell) => {
			cell.font = { bold: true }
			cell.alignment = { vertical: 'middle', horizontal: 'center' }
			cell.border = borderAll()
		})

		// Response
		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
		res.setHeader('Content-Disposition', 'attachment; filename="returning-report.xlsx"')

		await workbook.xlsx.write(res)
		res.end()

		// Helpers
		function formatDate(date: Date): string {
			const dd = String(date.getDate()).padStart(2, '0')
			const mm = String(date.getMonth() + 1).padStart(2, '0')
			const yyyy = date.getFullYear()
			const hh = String(date.getHours()).padStart(2, '0')
			const min = String(date.getMinutes()).padStart(2, '0')
			return `${dd}.${mm}.${yyyy} ${hh}:${min}`
		}

		function borderAll(): Partial<ExcelJS.Borders> {
			return {
				top: { style: 'thin', color: { argb: 'FF000000' } },
				left: { style: 'thin', color: { argb: 'FF000000' } },
				bottom: { style: 'thin', color: { argb: 'FF000000' } },
				right: { style: 'thin', color: { argb: 'FF000000' } },
			}
		}
	}

	async clientPaymentDownloadMany(res: Response, query: ClientPaymentFindManyRequest) {
		const startDate = query.startDate ? new Date(new Date(query.startDate).setHours(0, 0, 0, 0)) : undefined
		const endDate = query.endDate ? new Date(new Date(query.endDate).setHours(23, 59, 59, 999)) : undefined

		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const clientPayments = await this.prisma.paymentModel.findMany({
			where: {
				staffId: query.staffId,
				type: { in: [ServiceTypeEnum.client, ServiceTypeEnum.selling] },
				OR: [{ user: { fullname: { contains: query.search, mode: 'insensitive' } } }, { user: { phone: { contains: query.search, mode: 'insensitive' } } }],
				createdAt: {
					...(startDate && { gte: startDate }),
					...(endDate && { lte: endDate }),
				},
				NOT: { AND: [{ card: 0 }, { cash: 0 }, { transfer: 0 }, { other: 0 }] },
			},
			select: {
				user: { select: { fullname: true } },
				description: true,
				cash: true,
				card: true,
				transfer: true,
				other: true,
				staff: { select: { phone: true } },
				createdAt: true,
			},
			...paginationOptions,
			orderBy: { createdAt: 'desc' },
		})

		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Клиент оплаты')

		// Ustunlar
		worksheet.columns = [
			{ header: '№', key: 'no', width: 5 },
			{ header: 'Клиент', key: 'client', width: 30 },
			{ header: 'Информация', key: 'info', width: 35 },
			{ header: 'Оплата наличными', key: 'cash', width: 30 },
			{ header: 'Оплата банковской', key: 'card', width: 30 },
			{ header: 'Оплата перечислением', key: 'transfer', width: 30 },
			{ header: 'Оплата другими способами', key: 'other', width: 38 },
			{ header: 'Пользователь', key: 'staff', width: 30 },
			{ header: 'Дата', key: 'date', width: 30 },
		]

		// Header row styling
		const headerRow = worksheet.getRow(1)
		headerRow.eachCell((cell) => {
			cell.font = { bold: true }
			cell.alignment = { vertical: 'middle', horizontal: 'center' }
			cell.border = borderAll()
		})

		// Data rows
		clientPayments.forEach((payment, index) => {
			const row = worksheet.addRow({
				no: index + 1,
				client: payment.user.fullname,
				info: payment.description || '',
				cash: payment.cash.toNumber() || 0,
				card: payment.card.toNumber() || 0,
				transfer: payment.transfer.toNumber() || 0,
				other: payment.other.toNumber() || 0,
				staff: payment.staff.phone || '',
				date: formatDate(payment.createdAt),
			})

			row.eachCell((cell) => {
				cell.alignment = { vertical: 'middle', horizontal: 'center' }
				cell.border = borderAll()
			})
		})

		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
		res.setHeader('Content-Disposition', 'attachment; filename="client-payments.xlsx"')
		await workbook.xlsx.write(res)
		res.end()

		// Helperlar
		function formatDate(date: Date): string {
			const dd = String(date.getDate()).padStart(2, '0')
			const mm = String(date.getMonth() + 1).padStart(2, '0')
			const yyyy = date.getFullYear()
			const hh = String(date.getHours()).padStart(2, '0')
			const min = String(date.getMinutes()).padStart(2, '0')
			return `${dd}.${mm}.${yyyy} ${hh}:${min}`
		}

		function borderAll(): Partial<ExcelJS.Borders> {
			return {
				top: { style: 'thin', color: { argb: 'FF000000' } },
				left: { style: 'thin', color: { argb: 'FF000000' } },
				bottom: { style: 'thin', color: { argb: 'FF000000' } },
				right: { style: 'thin', color: { argb: 'FF000000' } },
			}
		}
	}

	async supplierPaymentDownloadMany(res: Response, query: ClientPaymentFindManyRequest) {
		const startDate = query.startDate ? new Date(new Date(query.startDate).setHours(0, 0, 0, 0)) : undefined
		const endDate = query.endDate ? new Date(new Date(query.endDate).setHours(23, 59, 59, 999)) : undefined

		const clientPayments = await this.prisma.paymentModel.findMany({
			where: {
				staffId: query.staffId,
				type: { in: [ServiceTypeEnum.supplier] },
				OR: [{ user: { fullname: { contains: query.search, mode: 'insensitive' } } }, { user: { phone: { contains: query.search, mode: 'insensitive' } } }],
				createdAt: {
					...(startDate && { gte: startDate }),
					...(endDate && { lte: endDate }),
				},
				NOT: { AND: [{ card: 0 }, { cash: 0 }, { transfer: 0 }, { other: 0 }] },
			},
			select: {
				user: { select: { fullname: true } },
				description: true,
				cash: true,
				card: true,
				transfer: true,
				other: true,
				staff: { select: { phone: true } },
				createdAt: true,
			},
			orderBy: { createdAt: 'desc' },
		})

		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Поставщик оплаты')

		worksheet.columns = [
			{ header: '№', key: 'no', width: 5 },
			{ header: 'Поставщик', key: 'supplier', width: 30 },
			{ header: 'Сумма', key: 'sum', width: 25 },
			{ header: 'Кем оприходан', key: 'staff', width: 20 },
			{ header: 'Информация', key: 'info', width: 30 },
			{ header: 'Дата', key: 'date', width: 20 },
		]

		const headerRow = worksheet.getRow(1)
		headerRow.eachCell((cell) => {
			cell.font = { bold: true }
			cell.alignment = { vertical: 'middle', horizontal: 'center' }
			cell.border = borderAll()
		})

		clientPayments.forEach((payment, index) => {
			const totalSum = payment.cash.plus(payment.card).plus(payment.transfer).plus(payment.other)

			const row = worksheet.addRow({
				no: index + 1,
				supplier: payment.user.fullname,
				sum: totalSum.toFixed(2),
				staff: payment.staff.phone || '',
				info: payment.description || '',
				date: formatDate(payment.createdAt),
			})

			row.eachCell((cell) => {
				cell.alignment = { vertical: 'middle', horizontal: 'center' }
				cell.border = borderAll()
			})
		})

		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
		res.setHeader('Content-Disposition', 'attachment; filename="supplier-payments.xlsx"')
		await workbook.xlsx.write(res)
		res.end()

		function formatDate(date: Date): string {
			const dd = String(date.getDate()).padStart(2, '0')
			const mm = String(date.getMonth() + 1).padStart(2, '0')
			const yyyy = date.getFullYear()
			const hh = String(date.getHours()).padStart(2, '0')
			const min = String(date.getMinutes()).padStart(2, '0')
			return `${dd}.${mm}.${yyyy} ${hh}:${min}`
		}

		function borderAll(): Partial<ExcelJS.Borders> {
			return {
				top: { style: 'thin', color: { argb: 'FF000000' } },
				left: { style: 'thin', color: { argb: 'FF000000' } },
				bottom: { style: 'thin', color: { argb: 'FF000000' } },
				right: { style: 'thin', color: { argb: 'FF000000' } },
			}
		}
	}

	async clientDeedDownloadOne(res: Response, query: ClientFindOneRequest) {
		const deedStartDate = query.deedStartDate ? new Date(new Date(query.deedStartDate).setHours(0, 0, 0, 0)) : undefined
		const deedEndDate = query.deedEndDate ? new Date(new Date(query.deedEndDate).setHours(23, 59, 59, 999)) : undefined

		const client = await this.prisma.userModel.findFirst({
			where: { id: query.id },
			select: {
				id: true,
				fullname: true,
				phone: true,
				actions: true,
				updatedAt: true,
				createdAt: true,
				deletedAt: true,
				payments: {
					where: { type: ServiceTypeEnum.client, createdAt: { gte: deedStartDate, lte: deedEndDate } },
					select: { card: true, cash: true, other: true, transfer: true, createdAt: true, description: true },
				},
				sellings: {
					where: { status: SellingStatusEnum.accepted, date: { gte: deedStartDate, lte: deedEndDate } },
					select: {
						date: true,
						products: { select: { cost: true, count: true, price: true } },
						payment: {
							where: { createdAt: { gte: deedStartDate, lte: deedEndDate } },
							select: { card: true, cash: true, other: true, transfer: true, createdAt: true, description: true },
						},
					},
					orderBy: { date: 'desc' },
				},
				returnings: {
					where: { status: SellingStatusEnum.accepted, createdAt: { gte: deedStartDate, lte: deedEndDate } },
					select: {
						payment: {
							where: { createdAt: { gte: deedStartDate, lte: deedEndDate } },
							select: { fromBalance: true, createdAt: true, description: true },
						},
					},
				},
			},
		})

		if (!client) throw new BadRequestException('client not found')

		const deeds: ClientDeed[] = []
		let totalDebit: Decimal = new Decimal(0)
		let totalCredit: Decimal = new Decimal(0)

		client.payments.forEach((curr) => {
			const totalPayment = curr.card.plus(curr.cash).plus(curr.other).plus(curr.transfer)
			deeds.push({ type: 'credit', action: 'payment', value: totalPayment, date: curr.createdAt, description: curr.description })
			totalCredit = totalCredit.plus(totalPayment)
		})

		client.sellings.forEach((sel) => {
			const productsSum = sel.products.reduce((a, p) => a.plus(p.price.mul(p.count)), new Decimal(0))
			deeds.push({ type: 'debit', action: 'selling', value: productsSum, date: sel.date, description: '' })
			totalDebit = totalDebit.plus(productsSum)

			const totalPayment = sel.payment.card.plus(sel.payment.cash).plus(sel.payment.other).plus(sel.payment.transfer)
			deeds.push({ type: 'credit', action: 'payment', value: totalPayment, date: sel.payment.createdAt, description: sel.payment.description })
			totalCredit = totalCredit.plus(totalPayment)
		})

		client.returnings.forEach((returning) => {
			deeds.push({
				type: 'credit',
				action: 'returning',
				value: returning.payment.fromBalance,
				date: returning.payment.createdAt,
				description: returning.payment.description,
			})
			totalCredit = totalCredit.plus(returning.payment.fromBalance)
		})

		const filteredDeeds = deeds.filter((d) => !d.value.equals(0)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

		///=====================
		const clientAllInfos = await this.prisma.userModel.findFirst({
			where: { id: query.id },
			select: {
				id: true,
				fullname: true,
				phone: true,
				actions: true,
				updatedAt: true,
				createdAt: true,
				deletedAt: true,
				payments: {
					where: { type: ServiceTypeEnum.client },
					select: { card: true, cash: true, other: true, transfer: true, createdAt: true, description: true },
				},
				sellings: {
					where: { status: SellingStatusEnum.accepted },
					select: {
						date: true,
						products: { select: { cost: true, count: true, price: true } },
						payment: {
							select: { card: true, cash: true, other: true, transfer: true, createdAt: true, description: true },
						},
					},
					orderBy: { date: 'desc' },
				},
				returnings: {
					where: { status: SellingStatusEnum.accepted },
					select: {
						payment: {
							select: { fromBalance: true, createdAt: true, description: true },
						},
					},
				},
			},
		})

		let totalDebit2: Decimal = new Decimal(0)
		let totalCredit2: Decimal = new Decimal(0)

		clientAllInfos.payments.forEach((curr) => {
			const totalPayment = curr.card.plus(curr.cash).plus(curr.other).plus(curr.transfer)
			totalCredit2 = totalCredit2.plus(totalPayment)
		})

		clientAllInfos.sellings.forEach((sel) => {
			const productsSum = sel.products.reduce((a, p) => a.plus(p.price.mul(p.count)), new Decimal(0))
			totalDebit2 = totalDebit2.plus(productsSum)

			const totalPayment = sel.payment.card.plus(sel.payment.cash).plus(sel.payment.other).plus(sel.payment.transfer)
			totalCredit2 = totalCredit2.plus(totalPayment)
		})

		clientAllInfos.returnings.forEach((returning) => {
			totalCredit2 = totalCredit2.plus(returning.payment.fromBalance)
		})
		///=====================

		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Клиент')

		const row1 = worksheet.addRow([`Клиент: ${client.fullname}`, '', '', `Остаток: ${totalDebit2.minus(totalCredit2).toNumber()}`, '', ''])
		worksheet.mergeCells(`A${row1.number}:C${row1.number}`)
		worksheet.mergeCells(`D${row1.number}:F${row1.number}`)
		styleRow(row1)

		const row2 = worksheet.addRow([
			`Акт сверки с ${this.formatDate(deedStartDate || filteredDeeds[0].date)} по ${this.formatDate(deedEndDate || filteredDeeds[filteredDeeds.length - 1].date)}`,
		])
		worksheet.mergeCells(`A${row2.number}:F${row2.number}`)
		styleRow(row2)

		worksheet.addRow([])

		const headerRow = worksheet.addRow(['№', 'Время', 'Операция', 'Дебит', 'Кредит', 'Описание'])
		headerRow.eachCell((cell) => {
			cell.font = { bold: true }
			cell.alignment = { vertical: 'middle', horizontal: 'center' }
			cell.border = borderAll()
		})

		filteredDeeds.forEach((deed, index) => {
			const row = worksheet.addRow([
				index + 1,
				this.formatDate(deed.date),
				deed.action,
				deed.type === 'debit' ? deed.value.toFixed(2) : '',
				deed.type === 'credit' ? deed.value.toFixed(2) : '',
				deed.description,
			])
			row.eachCell((cell) => {
				cell.alignment = { vertical: 'middle', horizontal: 'center' }
				cell.border = borderAll()
			})
		})

		const totalRow = worksheet.addRow(['', '', 'Итого', totalDebit.toFixed(2), totalCredit.toFixed(2)])
		styleRow(totalRow)

		const remainder = totalDebit.minus(totalCredit)
		const lastRow = worksheet.addRow(['', '', 'Конечный остаток', '', '', remainder.toFixed(2)])
		styleRow(lastRow)

		worksheet.columns = [{ width: 5 }, { width: 30 }, { width: 30 }, { width: 25 }, { width: 25 }, { width: 40 }]

		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
		res.setHeader('Content-Disposition', 'attachment; filename="client-deeds.xlsx"')

		await workbook.xlsx.write(res)
		res.end()

		function styleRow(row: ExcelJS.Row) {
			row.eachCell((cell) => {
				cell.font = { bold: true }
				cell.alignment = { vertical: 'middle', horizontal: 'center' }
				cell.border = borderAll()
			})
		}

		function borderAll(): Partial<ExcelJS.Borders> {
			return {
				top: { style: 'thin', color: { argb: 'FF000000' } },
				left: { style: 'thin', color: { argb: 'FF000000' } },
				bottom: { style: 'thin', color: { argb: 'FF000000' } },
				right: { style: 'thin', color: { argb: 'FF000000' } },
			}
		}
	}

	async clientDeedWithProductDownloadOne(res: Response, query: ClientFindOneRequest) {
		const deedStartDate = query.deedStartDate ? new Date(new Date(query.deedStartDate).setHours(0, 0, 0, 0)) : undefined
		const deedEndDate = query.deedEndDate ? new Date(new Date(query.deedEndDate).setHours(23, 59, 59, 999)) : undefined

		const client = await this.prisma.userModel.findFirst({
			where: { id: query.id },
			select: {
				fullname: true,
				payments: {
					where: { type: ServiceTypeEnum.client, createdAt: { gte: deedStartDate, lte: deedEndDate } },
					select: { card: true, cash: true, other: true, transfer: true, createdAt: true, description: true },
				},
				sellings: {
					where: { status: SellingStatusEnum.accepted, date: { gte: deedStartDate, lte: deedEndDate } },
					select: {
						date: true,
						products: { select: { product: { select: { name: true } }, cost: true, count: true, price: true, createdAt: true } },
						payment: {
							where: { createdAt: { gte: deedStartDate, lte: deedEndDate } },
							select: { card: true, cash: true, other: true, transfer: true, createdAt: true, description: true },
						},
					},
				},
				returnings: {
					where: { status: SellingStatusEnum.accepted, createdAt: { gte: deedStartDate, lte: deedEndDate } },
					select: {
						payment: {
							where: { createdAt: { gte: deedStartDate, lte: deedEndDate } },
							select: { fromBalance: true, createdAt: true, description: true },
						},
					},
				},
			},
		})

		if (!client) throw new BadRequestException('client not found')

		const deeds: (ClientDeed & { quantity: number; price: Decimal; cost: Decimal; name?: string })[] = []
		let totalDebit = new Decimal(0)
		let totalCredit = new Decimal(0)

		client.payments.forEach((curr) => {
			const total = curr.card.plus(curr.cash).plus(curr.other).plus(curr.transfer)
			deeds.push({ type: 'credit', action: 'payment', value: total, date: curr.createdAt, description: curr.description, cost: total, price: total, quantity: 1 })
			totalCredit = totalCredit.plus(total)
		})

		client.sellings.forEach((sel) => {
			sel.products.forEach((p) => {
				const price = p.price.mul(p.count)
				deeds.push({
					type: 'debit',
					action: 'selling',
					value: price,
					date: p.createdAt,
					description: '',
					cost: p.cost.mul(p.count),
					price,
					quantity: p.count,
					name: p.product.name,
				})
				totalDebit = totalDebit.plus(price)
			})

			const pay = sel.payment.card.plus(sel.payment.cash).plus(sel.payment.other).plus(sel.payment.transfer)
			deeds.push({ type: 'credit', action: 'payment', value: pay, date: sel.payment.createdAt, description: sel.payment.description, cost: pay, price: pay, quantity: 1 })
			totalCredit = totalCredit.plus(pay)
		})

		client.returnings.forEach((r) => {
			const bal = r.payment.fromBalance
			deeds.push({ type: 'credit', action: 'returning', value: bal, date: r.payment.createdAt, description: r.payment.description, cost: bal, price: bal, quantity: 1 })
			totalCredit = totalCredit.plus(bal)
		})

		const filtered = deeds.filter((d) => !d.value.equals(0)).sort((a, b) => a.date.getTime() - b.date.getTime())
		const rows = filtered.map((deed, i) => [i + 1, deed.name || '', deed.quantity, deed.price.toFixed(2), deed.cost.toFixed(2), deed.action, this.formatDate(deed.date)])

		///=====================
		const clientAllInfos = await this.prisma.userModel.findFirst({
			where: { id: query.id },
			select: {
				id: true,
				fullname: true,
				phone: true,
				actions: true,
				updatedAt: true,
				createdAt: true,
				deletedAt: true,
				payments: {
					where: { type: ServiceTypeEnum.client },
					select: { card: true, cash: true, other: true, transfer: true, createdAt: true, description: true },
				},
				sellings: {
					where: { status: SellingStatusEnum.accepted },
					select: {
						date: true,
						products: { select: { cost: true, count: true, price: true } },
						payment: {
							select: { card: true, cash: true, other: true, transfer: true, createdAt: true, description: true },
						},
					},
					orderBy: { date: 'desc' },
				},
				returnings: {
					where: { status: SellingStatusEnum.accepted },
					select: {
						payment: {
							select: { fromBalance: true, createdAt: true, description: true },
						},
					},
				},
			},
		})

		let totalDebit2: Decimal = new Decimal(0)
		let totalCredit2: Decimal = new Decimal(0)

		clientAllInfos.payments.forEach((curr) => {
			const totalPayment = curr.card.plus(curr.cash).plus(curr.other).plus(curr.transfer)
			totalCredit2 = totalCredit2.plus(totalPayment)
		})

		clientAllInfos.sellings.forEach((sel) => {
			const productsSum = sel.products.reduce((a, p) => a.plus(p.price.mul(p.count)), new Decimal(0))
			totalDebit2 = totalDebit2.plus(productsSum)

			const totalPayment = sel.payment.card.plus(sel.payment.cash).plus(sel.payment.other).plus(sel.payment.transfer)
			totalCredit2 = totalCredit2.plus(totalPayment)
		})

		clientAllInfos.returnings.forEach((returning) => {
			totalCredit2 = totalCredit2.plus(returning.payment.fromBalance)
		})
		///=====================

		const wb = new ExcelJS.Workbook()
		const ws = wb.addWorksheet('Клиент')

		const row1 = ws.addRow([`Клиент: ${client.fullname}`, '', '', `Остаток: ${totalDebit2.minus(totalCredit2).toFixed(2)}`, '', '', ''])
		ws.mergeCells(`A${row1.number}:C${row1.number}`)
		ws.mergeCells(`D${row1.number}:G${row1.number}`)
		styleRow(row1)

		const row2 = ws.addRow([`Акт сверки с ${this.formatDate(deedStartDate || filtered[0]?.date)} по ${this.formatDate(deedEndDate || filtered[filtered.length - 1]?.date)}`])
		ws.mergeCells(`A${row2.number}:G${row2.number}`)
		styleRow(row2)

		ws.addRow([])

		const header = ws.addRow(['№', 'Товар', 'Количество', 'Цена', 'Стоимость', 'Операция', 'Время'])
		header.eachCell((cell) => {
			cell.font = { bold: true }
			cell.alignment = { vertical: 'middle', horizontal: 'center' }
			cell.border = borderAll()
		})

		rows.forEach((data) => {
			const row = ws.addRow(data)
			row.eachCell((cell) => {
				cell.alignment = { vertical: 'middle', horizontal: 'center' }
				cell.border = borderAll()
			})
		})

		const totalRow = ws.addRow(['', '', '', '', '', 'Итого', ''])
		ws.mergeCells(`A${totalRow.number}:G${totalRow.number}`)
		styleRow(totalRow)

		const debitRow = ws.addRow(['', 'Продажи', '', '', totalDebit.toFixed(2), '', ''])
		styleRow(debitRow)

		const creditRow = ws.addRow(['', 'Оплата', '', '', totalCredit.toFixed(2), '', ''])
		styleRow(creditRow)

		ws.columns = [{ width: 5 }, { width: 30 }, { width: 15 }, { width: 15 }, { width: 20 }, { width: 20 }, { width: 30 }]

		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
		res.setHeader('Content-Disposition', 'attachment; filename="client-deeds-with-product.xlsx"')

		await wb.xlsx.write(res)
		res.end()

		function styleRow(row: ExcelJS.Row) {
			row.eachCell((cell) => {
				cell.font = { bold: true }
				cell.alignment = { vertical: 'middle', horizontal: 'center' }
				cell.border = borderAll()
			})
		}

		function borderAll(): Partial<ExcelJS.Borders> {
			return {
				top: { style: 'thin', color: { argb: 'FF000000' } },
				left: { style: 'thin', color: { argb: 'FF000000' } },
				bottom: { style: 'thin', color: { argb: 'FF000000' } },
				right: { style: 'thin', color: { argb: 'FF000000' } },
			}
		}
	}

	async supplierDeedDownloadOne(res: Response, query: ClientFindOneRequest) {
		const deedStartDate = query.deedStartDate ? new Date(new Date(query.deedStartDate).setHours(0, 0, 0, 0)) : undefined
		const deedEndDate = query.deedEndDate ? new Date(new Date(query.deedEndDate).setHours(23, 59, 59, 999)) : undefined

		const supplier = await this.prisma.userModel.findFirst({
			where: { id: query.id },
			select: {
				id: true,
				fullname: true,
				phone: true,
				actions: true,
				updatedAt: true,
				createdAt: true,
				deletedAt: true,
				payments: {
					where: { type: ServiceTypeEnum.supplier, createdAt: { gte: deedStartDate, lte: deedEndDate } },
					select: { card: true, cash: true, other: true, transfer: true, createdAt: true, description: true },
				},
				arrivals: {
					where: { date: { gte: deedStartDate, lte: deedEndDate } },
					select: {
						date: true,
						products: { select: { cost: true, count: true, price: true } },
						payment: {
							where: { createdAt: { gte: deedStartDate, lte: deedEndDate } },
							select: { card: true, cash: true, other: true, transfer: true, createdAt: true, description: true },
						},
					},
					orderBy: { date: 'desc' },
				},
			},
		})

		if (!supplier) throw new BadRequestException('supplier not found')

		const deeds: ClientDeed[] = []
		let totalDebit = new Decimal(0)
		let totalCredit = new Decimal(0)

		supplier.payments.forEach((curr) => {
			const totalPayment = curr.card.plus(curr.cash).plus(curr.other).plus(curr.transfer)
			deeds.push({ type: 'credit', action: 'payment', value: totalPayment, date: curr.createdAt, description: curr.description })
			totalCredit = totalCredit.plus(totalPayment)
		})

		supplier.arrivals.forEach((arr) => {
			const productsSum = arr.products.reduce((a, p) => a.plus(p.price.mul(p.count)), new Decimal(0))
			deeds.push({ type: 'debit', action: 'arrival', value: productsSum, date: arr.date, description: '' })
			totalDebit = totalDebit.plus(productsSum)

			const totalPayment = arr.payment.card.plus(arr.payment.cash).plus(arr.payment.other).plus(arr.payment.transfer)
			deeds.push({ type: 'credit', action: 'payment', value: totalPayment, date: arr.payment.createdAt, description: arr.payment.description })
			totalCredit = totalCredit.plus(totalPayment)
		})

		const filteredDeeds = deeds.filter((d) => !d.value.equals(0)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

		///=====================
		const supplierDeedInfos = await this.prisma.userModel.findFirst({
			where: { id: query.id },
			select: {
				id: true,
				fullname: true,
				phone: true,
				actions: true,
				updatedAt: true,
				createdAt: true,
				deletedAt: true,
				payments: {
					where: { type: ServiceTypeEnum.supplier },
					select: { card: true, cash: true, other: true, transfer: true, createdAt: true, description: true },
				},
				arrivals: {
					select: {
						date: true,
						products: { select: { cost: true, count: true, price: true } },
						payment: {
							select: { card: true, cash: true, other: true, transfer: true, createdAt: true, description: true },
						},
					},
					orderBy: { date: 'desc' },
				},
			},
		})

		let totalDebit2: Decimal = new Decimal(0)
		let totalCredit2: Decimal = new Decimal(0)
		supplierDeedInfos.payments.forEach((curr) => {
			const totalPayment = curr.card.plus(curr.cash).plus(curr.other).plus(curr.transfer)
			totalCredit2 = totalCredit2.plus(totalPayment)
		})

		supplierDeedInfos.arrivals.forEach((arr) => {
			const productsSum = arr.products.reduce((a, p) => a.plus(p.price.mul(p.count)), new Decimal(0))
			totalDebit2 = totalDebit2.plus(productsSum)

			const totalPayment = arr.payment.card.plus(arr.payment.cash).plus(arr.payment.other).plus(arr.payment.transfer)
			totalCredit2 = totalCredit2.plus(totalPayment)
		})
		///=====================

		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Поставшик')

		const row1 = worksheet.addRow([`Поставшик: ${supplier.fullname}`, '', '', `Остаток: ${totalDebit2.minus(totalCredit2).toFixed(2)}`, '', ''])
		worksheet.mergeCells(`A${row1.number}:C${row1.number}`)
		worksheet.mergeCells(`D${row1.number}:F${row1.number}`)
		styleRow(row1)

		const row2 = worksheet.addRow([
			`Акт сверки с ${this.formatDate(deedStartDate || filteredDeeds[0].date)} по ${this.formatDate(deedEndDate || filteredDeeds[filteredDeeds.length - 1].date)}`,
		])
		worksheet.mergeCells(`A${row2.number}:F${row2.number}`)
		styleRow(row2)

		worksheet.addRow([])

		const headerRow = worksheet.addRow(['№', 'Время', 'Операция', 'Дебит', 'Кредит', 'Описание'])
		headerRow.eachCell((cell) => {
			cell.font = { bold: true }
			cell.alignment = { vertical: 'middle', horizontal: 'center' }
			cell.border = borderAll()
		})

		filteredDeeds.forEach((deed, index) => {
			const row = worksheet.addRow([
				index + 1,
				this.formatDate(deed.date),
				deed.action,
				deed.type === 'debit' ? deed.value.toFixed(2) : '',
				deed.type === 'credit' ? deed.value.toFixed(2) : '',
				deed.description,
			])
			row.eachCell((cell) => {
				cell.alignment = { vertical: 'middle', horizontal: 'center' }
				cell.border = borderAll()
			})
		})

		const totalRow = worksheet.addRow(['', '', 'Итого', totalDebit.toFixed(2), totalCredit.toFixed(2), ''])
		styleRow(totalRow)

		const remainderRow = worksheet.addRow(['', '', 'Конечный остаток', '', totalDebit.minus(totalCredit).toFixed(2), ''])
		styleRow(remainderRow)

		worksheet.columns = [{ width: 5 }, { width: 30 }, { width: 30 }, { width: 25 }, { width: 25 }, { width: 40 }]

		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
		res.setHeader('Content-Disposition', 'attachment; filename="supplier-deeds.xlsx"')

		await workbook.xlsx.write(res)
		res.end()

		function styleRow(row: ExcelJS.Row) {
			row.eachCell((cell) => {
				cell.font = { bold: true }
				cell.alignment = { vertical: 'middle', horizontal: 'center' }
				cell.border = borderAll()
			})
		}

		function borderAll(): Partial<ExcelJS.Borders> {
			return {
				top: { style: 'thin', color: { argb: 'FF000000' } },
				left: { style: 'thin', color: { argb: 'FF000000' } },
				bottom: { style: 'thin', color: { argb: 'FF000000' } },
				right: { style: 'thin', color: { argb: 'FF000000' } },
			}
		}
	}

	async supplierDeedWithProductDownloadOne(res: Response, query: ClientFindOneRequest) {
		const deedStartDate = query.deedStartDate ? new Date(new Date(query.deedStartDate).setHours(0, 0, 0, 0)) : undefined
		const deedEndDate = query.deedEndDate ? new Date(new Date(query.deedEndDate).setHours(23, 59, 59, 999)) : undefined

		const supplier = await this.prisma.userModel.findFirst({
			where: { id: query.id },
			select: {
				id: true,
				fullname: true,
				phone: true,
				payments: {
					where: {
						type: ServiceTypeEnum.supplier,
						createdAt: { gte: deedStartDate, lte: deedEndDate },
					},
					select: { card: true, cash: true, other: true, transfer: true, createdAt: true, description: true },
				},
				arrivals: {
					where: { date: { gte: deedStartDate, lte: deedEndDate } },
					select: {
						date: true,
						products: {
							select: {
								product: { select: { name: true } },
								cost: true,
								count: true,
								price: true,
								createdAt: true,
							},
						},
						payment: {
							where: { createdAt: { gte: deedStartDate, lte: deedEndDate } },
							select: { card: true, cash: true, other: true, transfer: true, createdAt: true, description: true },
						},
					},
					orderBy: { date: 'desc' },
				},
			},
		})

		if (!supplier) throw new BadRequestException('client not found')

		const deeds: (ClientDeed & { quantity: number; price: Decimal; cost: Decimal; name?: string })[] = []
		let totalDebit = new Decimal(0)
		let totalCredit = new Decimal(0)

		supplier.payments.forEach((curr) => {
			const total = curr.card.plus(curr.cash).plus(curr.other).plus(curr.transfer)
			deeds.push({
				type: 'credit',
				action: 'payment',
				value: total,
				date: curr.createdAt,
				description: curr.description,
				cost: total,
				price: total,
				quantity: 1,
			})
			totalCredit = totalCredit.plus(total)
		})

		supplier.arrivals.forEach((arr) => {
			const sum = arr.products.reduce((acc, p) => {
				const price = p.price.mul(p.count)
				const cost = p.cost.mul(p.count)

				deeds.push({
					type: 'debit',
					action: 'arrival',
					value: price,
					date: p.createdAt,
					description: '',
					name: p.product.name,
					price,
					cost,
					quantity: p.count,
				})

				return acc.plus(price)
			}, new Decimal(0))

			totalDebit = totalDebit.plus(sum)

			const payment = arr.payment.card.plus(arr.payment.cash).plus(arr.payment.other).plus(arr.payment.transfer)
			if (!payment.isZero()) {
				deeds.push({
					type: 'credit',
					action: 'payment',
					value: payment,
					date: arr.payment.createdAt,
					description: arr.payment.description,
					price: payment,
					cost: payment,
					quantity: 1,
				})
				totalCredit = totalCredit.plus(payment)
			}
		})

		const filteredDeeds = deeds.filter((d) => !d.value.isZero()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

		///=====================
		const supplierDeedInfos = await this.prisma.userModel.findFirst({
			where: { id: query.id },
			select: {
				id: true,
				fullname: true,
				phone: true,
				actions: true,
				updatedAt: true,
				createdAt: true,
				deletedAt: true,
				payments: {
					where: { type: ServiceTypeEnum.supplier },
					select: { card: true, cash: true, other: true, transfer: true, createdAt: true, description: true },
				},
				arrivals: {
					select: {
						date: true,
						products: { select: { cost: true, count: true, price: true } },
						payment: {
							select: { card: true, cash: true, other: true, transfer: true, createdAt: true, description: true },
						},
					},
					orderBy: { date: 'desc' },
				},
			},
		})

		let totalDebit2: Decimal = new Decimal(0)
		let totalCredit2: Decimal = new Decimal(0)
		supplierDeedInfos.payments.forEach((curr) => {
			const totalPayment = curr.card.plus(curr.cash).plus(curr.other).plus(curr.transfer)
			totalCredit2 = totalCredit2.plus(totalPayment)
		})

		supplierDeedInfos.arrivals.forEach((arr) => {
			const productsSum = arr.products.reduce((a, p) => a.plus(p.price.mul(p.count)), new Decimal(0))
			totalDebit2 = totalDebit2.plus(productsSum)

			const totalPayment = arr.payment.card.plus(arr.payment.cash).plus(arr.payment.other).plus(arr.payment.transfer)
			totalCredit2 = totalCredit2.plus(totalPayment)
		})
		///=====================

		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Поставшик')

		worksheet.columns = [
			{ key: 'no', width: 5 },
			{ key: 'name', width: 25 },
			{ key: 'quantity', width: 15 },
			{ key: 'price', width: 15 },
			{ key: 'cost', width: 15 },
			{ key: 'action', width: 15 },
			{ key: 'date', width: 20 },
		]

		// === 1-2 qator ===
		const row1 = worksheet.addRow([`Клиент: ${supplier.fullname}`, '', '', `Остаток: ${totalDebit2.minus(totalCredit2).toFixed(2)}`, '', '', ''])
		worksheet.mergeCells('A1:C1')
		worksheet.mergeCells('D1:G1')

		const fromDate = this.formatDate(deedStartDate || filteredDeeds[0]?.date)
		const toDate = this.formatDate(deedEndDate || filteredDeeds[filteredDeeds.length - 1]?.date)

		const row2 = worksheet.addRow([`Акт сверки с ${fromDate} по ${toDate}`])
		worksheet.mergeCells('A2:G2')
		;[row1, row2].forEach((row) =>
			row.eachCell((cell) => {
				cell.font = { bold: true }
				cell.alignment = { horizontal: 'center', vertical: 'middle' }
				cell.border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' },
				}
			}),
		)

		worksheet.addRow([])

		// === Header row ===
		const headerRow = worksheet.addRow(['№', 'Товар', 'Количество', 'Цена', 'Стоимость', 'Операция', 'Время'])
		headerRow.font = { bold: true }
		headerRow.eachCell((cell) => {
			cell.alignment = { vertical: 'middle', horizontal: 'center' }
			cell.border = {
				top: { style: 'thin' },
				left: { style: 'thin' },
				bottom: { style: 'thin' },
				right: { style: 'thin' },
			}
		})

		// === Data rows ===
		filteredDeeds.forEach((deed, index) => {
			const row = worksheet.addRow([index + 1, deed.name || '', deed.quantity, deed.price.toNumber(), deed.cost.toNumber(), deed.action, this.formatDate(deed.date)])
			row.eachCell((cell) => {
				cell.alignment = { vertical: 'middle', horizontal: 'center' }
				cell.border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' },
				}
			})
		})

		// === Totals ===
		const totalDebitRow = worksheet.addRow(['', 'Итого приходов:', '', '', totalDebit.toNumber(), '', ''])
		const totalCreditRow = worksheet.addRow(['', 'Итого выплат:', '', '', totalCredit.toNumber(), '', ''])

		;[totalDebitRow, totalCreditRow].forEach((row) =>
			row.eachCell((cell) => {
				cell.font = { bold: true }
				cell.alignment = { vertical: 'middle', horizontal: 'center' }
				cell.border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' },
				}
			}),
		)

		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
		res.setHeader('Content-Disposition', 'attachment; filename="supplier-deeds-with-product.xlsx"')
		await workbook.xlsx.write(res)
		res.end()
	}

	async clientDownloadMany(res: Response, query: ClientFindManyRequest) {
		const clients = await this.prisma.userModel.findMany({
			where: {
				fullname: query.fullname,
				type: UserTypeEnum.client,
				OR: [{ fullname: { contains: query.search, mode: 'insensitive' } }, { phone: { contains: query.search, mode: 'insensitive' } }],
			},
			select: {
				fullname: true,
				phone: true,
				payments: {
					where: { type: ServiceTypeEnum.client, deletedAt: null },
					select: { card: true, cash: true, other: true, transfer: true },
				},
				sellings: {
					where: { status: SellingStatusEnum.accepted },
					select: {
						date: true,
						payment: { select: { card: true, cash: true, other: true, transfer: true } },
						products: { select: { count: true, price: true } },
					},
					orderBy: { date: 'desc' },
				},
			},
		})

		const mappedClients = clients.map((c) => {
			const payment = c.payments.reduce((acc, curr) => acc.plus(curr.card).plus(curr.cash).plus(curr.other).plus(curr.transfer), new Decimal(0))

			const sellingPayment = c.sellings.reduce((acc, sel) => {
				const productsSum = sel.products.reduce((a, p) => a.plus(p.price.mul(p.count)), new Decimal(0))
				const totalPayment = sel.payment.card.plus(sel.payment.cash).plus(sel.payment.other).plus(sel.payment.transfer)
				return acc.plus(productsSum).minus(totalPayment)
			}, new Decimal(0))

			return {
				fullname: c.fullname,
				phone: c.phone,
				debt: sellingPayment.minus(payment),
				lastSellingDate: c.sellings?.[0]?.date ?? null,
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
				}
			}
			return true
		})

		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Клиенты с долгом')

		worksheet.columns = [
			{ header: '№', key: 'no', width: 5 },
			{ header: 'клиент', key: 'fullname', width: 40 },
			{ header: 'телефон', key: 'phone', width: 20 },
			{ header: 'долг', key: 'debt', width: 20 },
			{ header: 'последняя дата продажи', key: 'lastSellingDate', width: 50 },
		]

		worksheet.getRow(1).eachCell((cell) => {
			cell.font = { bold: true }
			cell.alignment = { vertical: 'middle', horizontal: 'center' }
			cell.fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'FFB6D7A8' },
			}
			cell.border = this.allBorder()
		})

		filteredClients.forEach((client, index) => {
			const row = worksheet.addRow({
				no: index + 1,
				fullname: client.fullname,
				phone: client.phone,
				debt: client.debt.toFixed(2),
				lastSellingDate: client.lastSellingDate
					? new Date(client.lastSellingDate).toLocaleString('ru-RU', {
							year: 'numeric',
							month: '2-digit',
							day: '2-digit',
							hour: '2-digit',
							minute: '2-digit',
						})
					: '',
			})

			row.eachCell((cell) => {
				cell.alignment = { vertical: 'middle', horizontal: 'center' }
				cell.border = this.allBorder()
			})
		})

		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
		res.setHeader('Content-Disposition', 'attachment; filename="client-debt-report.xlsx"')

		await workbook.xlsx.write(res)
		res.end()
	}

	async supplierDownloadMany(res: Response, query: ClientFindManyRequest) {
		const suppliers = await this.prisma.userModel.findMany({
			where: {
				type: UserTypeEnum.supplier,
				OR: [{ fullname: { contains: query.search, mode: 'insensitive' } }, { phone: { contains: query.search, mode: 'insensitive' } }],
			},
			select: {
				id: true,
				fullname: true,
				phone: true,
				arrivals: {
					select: {
						date: true,
						payment: { select: { card: true, cash: true, other: true, transfer: true } },
						products: { select: { cost: true, count: true, price: true } },
					},
					orderBy: { date: 'desc' },
				},
				payments: {
					where: { type: ServiceTypeEnum.supplier },
					select: { card: true, cash: true, other: true, transfer: true },
				},
				actions: true,
				updatedAt: true,
				createdAt: true,
				deletedAt: true,
			},
		})

		const mappedSuppliers = suppliers.map((s) => {
			const payment = s.payments.reduce((acc, curr) => acc.plus(curr.card).plus(curr.cash).plus(curr.other).plus(curr.transfer), new Decimal(0))

			const arrivalPayment = s.arrivals.reduce((acc, arr) => {
				const productsSum = arr.products.reduce((a, p) => {
					return a.plus(p.cost.mul(p.count))
				}, new Decimal(0))

				const totalPayment = arr.payment.card.plus(arr.payment.cash).plus(arr.payment.other).plus(arr.payment.transfer)

				return acc.plus(productsSum).minus(totalPayment)
			}, new Decimal(0))
			return {
				...s,
				debt: payment.plus(arrivalPayment),
				lastArrivalDate: s.arrivals?.length ? s.arrivals[0].date : null,
			}
		})

		const filteredSuppliers = mappedSuppliers.filter((s) => {
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

		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Клиенты с долгом')

		worksheet.columns = [
			{ header: '№', key: 'no', width: 5 },
			{ header: 'клиент', key: 'fullname', width: 40 },
			{ header: 'телефон', key: 'phone', width: 20 },
			{ header: 'долг', key: 'debt', width: 20 },
			{ header: 'Время', key: 'lastSellingDate', width: 30 },
		]

		worksheet.getRow(1).eachCell((cell) => {
			cell.font = { bold: true }
			cell.alignment = { vertical: 'middle', horizontal: 'center' }
			cell.fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'FFB6D7A8' },
			}
			cell.border = this.allBorder()
		})

		filteredSuppliers.forEach((client, index) => {
			const row = worksheet.addRow({
				no: index + 1,
				fullname: client.fullname,
				phone: client.phone,
				debt: client.debt.toFixed(2),
				lastSellingDate: client.lastArrivalDate
					? new Date(client.lastArrivalDate).toLocaleString('ru-RU', {
							year: 'numeric',
							month: '2-digit',
							day: '2-digit',
							hour: '2-digit',
							minute: '2-digit',
						})
					: '',
			})

			row.eachCell((cell) => {
				cell.alignment = { vertical: 'middle', horizontal: 'center' }
				cell.border = this.allBorder()
			})
		})

		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
		res.setHeader('Content-Disposition', 'attachment; filename="supplier-debt-report.xlsx"')

		await workbook.xlsx.write(res)
		res.end()
	}

	async staffPaymentDownloadMany(res: Response, query: StaffPaymentFindManyRequest) {
		const staffPayments = await this.prisma.paymentModel.findMany({
			where: {
				staffId: query.staffId,
				type: ServiceTypeEnum.staff,
				createdAt: {
					gte: query.startDate ? new Date(new Date(query.startDate).setHours(0, 0, 0, 0)) : undefined,
					lte: query.endDate ? new Date(new Date(query.endDate).setHours(23, 59, 59, 999)) : undefined,
				},
			},
			select: {
				id: true,
				user: { select: { id: true, fullname: true, phone: true } },
				staff: { select: { id: true, fullname: true, phone: true } },
				sum: true,
				description: true,
				updatedAt: true,
				createdAt: true,
				deletedAt: true,
			},
		})

		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Оплаты сотрудника')

		// Ustun eni
		worksheet.columns = [
			{ key: 'no', width: 5 },
			{ key: 'fullname', width: 30 },
			{ key: 'phone', width: 20 },
			{ key: 'amount', width: 20 },
			{ key: 'description', width: 30 },
			{ key: 'createdAt', width: 25 },
		]

		// Header rus tilida
		const headerRow = worksheet.addRow(['№', 'ФИО', 'Телефон', 'Сумма оплаты', 'Примечание', 'Дата оплаты'])

		headerRow.eachCell((cell) => {
			cell.font = { bold: true }
			cell.alignment = { vertical: 'middle', horizontal: 'center' }
			cell.border = {
				top: { style: 'thin', color: { argb: 'FF000000' } },
				left: { style: 'thin', color: { argb: 'FF000000' } },
				bottom: { style: 'thin', color: { argb: 'FF000000' } },
				right: { style: 'thin', color: { argb: 'FF000000' } },
			}
		})

		// Ma'lumotlar
		staffPayments.forEach((item, index) => {
			const row = worksheet.addRow([index + 1, item.user.fullname, item.user.phone, item.sum.toNumber(), item.description || '', item.createdAt.toLocaleString('ru-RU')])

			row.eachCell((cell) => {
				cell.alignment = { vertical: 'middle', horizontal: 'center' }
				cell.border = {
					top: { style: 'thin', color: { argb: 'FF000000' } },
					left: { style: 'thin', color: { argb: 'FF000000' } },
					bottom: { style: 'thin', color: { argb: 'FF000000' } },
					right: { style: 'thin', color: { argb: 'FF000000' } },
				}
			})
		})

		// Javobga yozish
		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
		res.setHeader('Content-Disposition', 'attachment; filename="staff-payments.xlsx"')

		await workbook.xlsx.write(res)
		res.end()
	}

	private formatDate(date: Date): string {
		const dd = String(date.getDate()).padStart(2, '0')
		const mm = String(date.getMonth() + 1).padStart(2, '0') // 0-based
		const yyyy = date.getFullYear()

		const hh = String(date.getHours()).padStart(2, '0')
		const min = String(date.getMinutes()).padStart(2, '0')

		return `${dd}.${mm}.${yyyy} ${hh}:${min}`
	}

	allBorder(): Partial<ExcelJS.Borders> {
		return {
			top: { style: 'thin', color: { argb: 'FF000000' } },
			left: { style: 'thin', color: { argb: 'FF000000' } },
			bottom: { style: 'thin', color: { argb: 'FF000000' } },
			right: { style: 'thin', color: { argb: 'FF000000' } },
		}
	}
}
