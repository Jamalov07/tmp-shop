import { Injectable } from '@nestjs/common'
import { PrismaService } from '../shared'
import { createResponse, CRequest } from '../../common'
import { PublicIdSearchRequest } from './interfaces'

@Injectable()
export class PublicIdService {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}
	async search(request: CRequest, query: PublicIdSearchRequest) {
		const cart = await this.prisma.cartModel.findFirst({ where: { publicId: query.id } })

		if (cart && cart.staffId === request.user.id) {
			return createResponse({ data: { exists: true, isUsable: true }, success: { messages: ['search success'] }, warning: { is: true, messages: ['already exists in your cart'] } })
		}

		const orderProduct = await this.prisma.orderProductModel.findFirst({ where: { publicId: query.id } })
		if (orderProduct) {
			return createResponse({
				data: { exists: true, isUsable: false },
				success: { messages: ['search success'] },
				warning: { is: true, messages: ['already exists in order product'] },
			})
		} else {
			return createResponse({ data: { exists: false, isUsable: true }, success: { messages: ['search success'] } })
		}
	}
	async generate(request: CRequest) {
		const cart = await this.prisma.cartModel.findFirst({
			where: { staffId: request.user.id },
		})

		if (cart) {
			return createResponse({
				data: { id: cart.publicId },
				success: { messages: ['generate success'] },
				warning: { is: true, messages: ['already generated in cart'] },
			})
		}

		const newPublicId = await this.generatingNewPublicId()
		return createResponse({ data: { id: newPublicId }, success: { messages: ['generate success'] } })
	}

	async generatingNewPublicId(): Promise<string> {
		const lastRecord = await this.prisma.publicIdModel.findFirst({
			orderBy: { createdAt: 'desc' },
		})

		let newId = lastRecord ? lastRecord.id : 'AA000000'

		// agar lastRecord mavjud bo‘lsa, u ishlatilganmi tekshiramiz
		if (lastRecord && (await this.isPublicIdInUse(newId))) {
			newId = this.incrementPublicId(newId)
			// keyingilarni ham tekshirib chiqamiz
			while (await this.isPublicIdInUse(newId)) {
				newId = this.incrementPublicId(newId)
			}
		}

		// bazaga yozamiz
		await this.prisma.publicIdModel.create({ data: { id: newId } }).catch((undefined): undefined => undefined)
		return newId
	}

	private async isPublicIdInUse(id: string): Promise<boolean> {
		const inCart = await this.prisma.cartModel.findFirst({ where: { publicId: id } })
		const inOrderProduct = await this.prisma.orderProductModel.findFirst({ where: { publicId: id } })

		return !!inCart || !!inOrderProduct
	}

	private incrementPublicId(current: string): string {
		const letters = current.slice(0, 2)
		const numbers = parseInt(current.slice(2), 10)

		let nextNumbers = numbers + 1
		let nextLetters = letters

		if (nextNumbers > 999999) {
			nextNumbers = 0

			let firstCharCode = letters.charCodeAt(0)
			let secondCharCode = letters.charCodeAt(1)

			secondCharCode++
			if (secondCharCode > 90) {
				secondCharCode = 65
				firstCharCode++
				if (firstCharCode > 90) {
					throw new Error('Public ID limit reached!')
				}
			}

			nextLetters = String.fromCharCode(firstCharCode) + String.fromCharCode(secondCharCode)
		}

		const nextNumbersStr = nextNumbers.toString().padStart(6, '0')

		return nextLetters + nextNumbersStr
	}
}
