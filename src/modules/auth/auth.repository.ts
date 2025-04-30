import { Injectable } from '@nestjs/common'
import { PrismaService } from '../shared'
import { UserSignInRequest } from './interfaces'
import { deletedAtConverter } from '../../common'

@Injectable()
export class AuthRepository {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async findOneUser(body: UserSignInRequest) {
		const staff = await this.prisma.staffModel.findFirst({
			where: { phone: body.phone },
		})
		if (!staff) {
			const partner = await this.prisma.partnerModel.findFirst({
				where: { phone: body.phone },
			})

			if (!partner) {
				return { type: null, user: null }
			} else {
				return { type: 'partner', user: partner }
			}
		} else {
			return { type: 'staff', user: staff }
		}
	}

	async getOneUser(body: { id?: string; token?: string; isDeleted?: boolean }) {
		const staff = await this.prisma.staffModel.findFirst({
			where: {
				id: body.id,
				token: body.token,
				deletedAt: deletedAtConverter(body.isDeleted),
			},
		})

		if (!staff) {
			const partner = await this.prisma.partnerModel.findFirst({
				where: {
					id: body.id,
					token: body.token,
					deletedAt: deletedAtConverter(body.isDeleted),
				},
			})
			if (!partner) {
				return { type: null, user: null }
			} else {
				return { type: 'partner', user: staff }
			}
		} else {
			return { type: 'staff', user: staff }
		}
	}
}
