import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthRepository } from './auth.repository'
import { AuthGetValidTokensRequest, AuthSignOutRequest, UserSignInRequest } from './interfaces'
import * as bcrypt from 'bcryptjs'
import { createResponse } from '../../common'
import { JsonWebTokenService } from './jwt.service'
import { StaffRepository } from '../staff'
import { PartnerRepository } from '../partner'

@Injectable()
export class AuthService {
	private readonly authRepository: AuthRepository
	private readonly jwtService: JsonWebTokenService
	private readonly staffRepository: StaffRepository
	private readonly partnerRepository: PartnerRepository

	constructor(authRepository: AuthRepository, jwtService: JsonWebTokenService, staffRepository: StaffRepository, partnerRepository: PartnerRepository) {
		this.authRepository = authRepository
		this.jwtService = jwtService
		this.staffRepository = staffRepository
		this.partnerRepository = partnerRepository
	}

	async signIn(body: UserSignInRequest) {
		const { type, user } = await this.authRepository.findOneUser(body)

		if (!user) {
			throw new UnauthorizedException('user unauthorized')
		}

		if (user.deletedAt) {
			throw new BadRequestException('user was deleted')
		}

		const isCorrect = await bcrypt.compare(body.password, user.password)
		if (!isCorrect) {
			throw new UnauthorizedException('wrong password')
		}
		delete user.password
		delete user.token

		const tokens = await this.jwtService.getTokens({ id: user.id })

		if (type === 'staff') {
			await this.staffRepository.updateOne({ id: user.id }, { token: tokens.refreshToken })
		} else {
			await this.partnerRepository.updateOne({ id: user.id }, { token: tokens.refreshToken })
		}

		return createResponse({ data: { user: { ...user }, tokens: tokens }, success: { messages: ['sign in success'] } })
	}

	async signOut(body: AuthSignOutRequest) {
		const { type, user } = await this.authRepository.getOneUser({ id: body.user?.id, isDeleted: false })

		if (!user.token) {
			return createResponse({ data: null, success: { messages: ['sign out success'] }, warning: { is: true, messages: ['already sign out'] } })
		}
		if (type === 'staff') {
			await this.staffRepository.updateOne({ id: user.id }, { token: '' })
		} else {
			await this.partnerRepository.updateOne({ id: user.id }, { token: '' })
		}
		return createResponse({ data: null, success: { messages: ['sign out success'] } })
	}

	async getValidTokens(body: AuthGetValidTokensRequest) {
		const { type, user } = await this.authRepository.getOneUser({ id: body.user.id, token: body.user.token, isDeleted: false })

		if (!user) {
			throw new UnauthorizedException('user not found')
		}

		delete user.password
		delete user.token

		const tokens = await this.jwtService.getTokens({ id: body.user.id })

		if (type === 'staff') {
			await this.staffRepository.updateOne({ id: user.id }, { token: tokens.refreshToken })
		} else {
			await this.partnerRepository.updateOne({ id: user.id }, { token: tokens.refreshToken })
		}
		return createResponse({ data: { user: user, tokens: tokens }, success: { messages: ['refresh token success'] } })
	}
}
