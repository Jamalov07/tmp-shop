import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { createResponse } from '@common'
import { AuthGetValidTokensRequest, AuthSignOutRequest, PartnerSignInRequest } from './interfaces'
import { JsonWebTokenService } from '../jwt.service'
import { PartnerAuthRepository } from './partner-auth.repository'
import { PartnerRepository } from '../../partner'

@Injectable()
export class PartnerAuthService {
	private readonly authRepository: PartnerAuthRepository
	private readonly jwtService: JsonWebTokenService
	private readonly partnerRepository: PartnerRepository

	constructor(authRepository: PartnerAuthRepository, jwtService: JsonWebTokenService, partnerRepository: PartnerRepository) {
		this.authRepository = authRepository
		this.partnerRepository = partnerRepository
		this.jwtService = jwtService
	}

	async signIn(body: PartnerSignInRequest) {
		const partner = await this.authRepository.findOnePartner(body)

		if (!partner) {
			throw new UnauthorizedException('partner unauthorized')
		}

		if (partner.deletedAt) {
			throw new BadRequestException('partner was deleted')
		}

		const isCorrect = await bcrypt.compare(body.password, partner.password)
		if (!isCorrect) {
			throw new UnauthorizedException('wrong password')
		}
		delete partner.password
		delete partner.token

		const tokens = await this.jwtService.getTokens({ id: partner.id })
		await this.partnerRepository.updateOne({ id: partner.id }, { token: tokens.refreshToken })

		return createResponse({ data: { partner: { ...partner }, tokens: tokens }, success: { messages: ['sign in success'] } })
	}

	async signOut(body: AuthSignOutRequest) {
		const partner = await this.partnerRepository.getOne({ id: body.partner?.id, isDeleted: false })

		if (!partner.token) {
			return createResponse({ data: null, success: { messages: ['sign out success'] }, warning: { is: true, messages: ['already sign out'] } })
		}
		await this.partnerRepository.updateOne({ id: partner.id }, { token: '' })

		return createResponse({ data: null, success: { messages: ['sign out success'] } })
	}

	async getValidTokens(body: AuthGetValidTokensRequest) {
		const partner = await this.partnerRepository.getOne({ id: body.partner.id, token: body.partner.token, isDeleted: false })

		if (!partner) {
			throw new UnauthorizedException('partner not found')
		}

		delete partner.token

		const tokens = await this.jwtService.getTokens({ id: body.partner.id })
		await this.partnerRepository.updateOne({ id: partner.id }, { token: tokens.refreshToken })
		return createResponse({ data: { partner: partner, tokens: tokens }, success: { messages: ['refresh token success'] } })
	}
}
