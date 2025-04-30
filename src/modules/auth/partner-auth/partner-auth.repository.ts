import { Injectable } from '@nestjs/common'
import { PrismaService } from '@shared'
import { PartnerSignInRequest } from './interfaces'

@Injectable()
export class PartnerAuthRepository {
	private readonly prisma: PrismaService

	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async findOnePartner(body: PartnerSignInRequest) {
		const user = await this.prisma.partnerModel.findFirst({
			where: { phone: body.phone },
		})

		return user
	}
}
