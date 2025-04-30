import { ApiProperty, IntersectionType } from '@nestjs/swagger'
import { PartnerSignInData, PartnerSignInResponse, Tokens } from '../interfaces'
import { GlobalModifyResponseDto, GlobalResponseDto } from '@common'
import { PartnerOptional, PartnerOptionalDto } from '../../partner'

export class TokensDto implements Tokens {
	@ApiProperty({ type: String })
	accessToken: string

	@ApiProperty({ type: String })
	refreshToken: string
}

export class UserSignInDataDto implements PartnerSignInData {
	@ApiProperty({ type: PartnerOptionalDto })
	user: PartnerOptional

	@ApiProperty({ type: TokensDto })
	tokens: Tokens
}

export class UserSignInResponseDto extends GlobalResponseDto implements PartnerSignInResponse {
	@ApiProperty({ type: UserSignInDataDto })
	data: PartnerSignInData
}

export class AuthModifyResponseDto extends IntersectionType(GlobalResponseDto, GlobalModifyResponseDto) {}
