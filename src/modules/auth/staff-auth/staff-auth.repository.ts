import { Injectable } from '@nestjs/common'
import { PrismaService } from '@shared'
import { StaffSignInRequest } from './interfaces'

@Injectable()
export class StaffAuthRepository {
	private readonly prisma: PrismaService

	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async findOneStaff(body: StaffSignInRequest) {
		const user = await this.prisma.staffModel.findFirst({
			where: { phone: body.phone },
		})

		return user
	}
}
