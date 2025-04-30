import { ApiProperty, IntersectionType } from '@nestjs/swagger'
import { PartnerSignInData, PartnerSignInResponse } from '../interfaces'
import { PartnerOptional, PartnerOptionalDto } from '../../../partner'
import { GlobalModifyResponseDto, GlobalResponseDto } from '@common'
import { Tokens } from '../../interfaces'

export class TokensDto implements Tokens {
	@ApiProperty({ type: String })
	accessToken: string

	@ApiProperty({ type: String })
	refreshToken: string
}

export class PartnerSignInDataDto implements PartnerSignInData {
	@ApiProperty({ type: PartnerOptionalDto })
	partner: PartnerOptional

	@ApiProperty({ type: TokensDto })
	tokens: Tokens
}

export class PartnerSignInResponseDto extends GlobalResponseDto implements PartnerSignInResponse {
	@ApiProperty({ type: PartnerSignInDataDto })
	data: PartnerSignInData
}

export class AuthModifyResponseDto extends IntersectionType(GlobalResponseDto, GlobalModifyResponseDto) {}
