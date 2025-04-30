import { Body, Controller, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { PartnerAuthService } from './partner-auth.service'
import { AuthModifyResponseDto, PartnerSignInRequestDto, PartnerSignInResponseDto } from './dtos'
import { CRequest, AuthOptions, RefreshTokenInterceptor } from '@common'

@ApiTags('Auth')
@Controller('auth/partner')
export class PartnerAuthController {
	private readonly authService: PartnerAuthService
	constructor(authService: PartnerAuthService) {
		this.authService = authService
	}

	@Post('sign-in')
	@ApiOperation({ summary: 'sign in partner' })
	@ApiOkResponse({ type: PartnerSignInResponseDto })
	async signIn(@Body() body: PartnerSignInRequestDto): Promise<PartnerSignInResponseDto> {
		return this.authService.signIn(body)
	}

	@Post('sign-out')
	@AuthOptions(true, true)
	@ApiOperation({ summary: 'sign out partner' })
	@ApiOkResponse({ type: AuthModifyResponseDto })
	async signOut(@Req() request: CRequest): Promise<AuthModifyResponseDto> {
		return this.authService.signOut({ partner: request.user })
	}

	@Post('refresh-token')
	@ApiOperation({ summary: 'refresh token' })
	@ApiOkResponse({ type: PartnerSignInResponseDto })
	@UseInterceptors(RefreshTokenInterceptor)
	async getValidTokensWithRefresh(@Req() request: CRequest) {
		return this.authService.getValidTokens({ partner: request.user })
	}
}
