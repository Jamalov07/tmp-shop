import { Body, Controller, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { StaffAuthService } from './staff-auth.service'
import { AuthModifyResponseDto, StaffSignInRequestDto, StaffSignInResponseDto } from './dtos'
import { CRequest, AuthOptions, RefreshTokenInterceptor } from '@common'
@ApiTags('Auth')
@Controller('auth/staff')
export class StaffAuthController {
	private readonly authService: StaffAuthService
	constructor(authService: StaffAuthService) {
		this.authService = authService
	}

	@Post('sign-in')
	@ApiOperation({ summary: 'sign in staff' })
	@ApiOkResponse({ type: StaffSignInResponseDto })
	async signIn(@Body() body: StaffSignInRequestDto): Promise<StaffSignInResponseDto> {
		return this.authService.signIn(body)
	}

	@Post('sign-out')
	@AuthOptions(true, true)
	@ApiOperation({ summary: 'sign out staff' })
	@ApiOkResponse({ type: AuthModifyResponseDto })
	async signOut(@Req() request: CRequest): Promise<AuthModifyResponseDto> {
		return this.authService.signOut({ staff: request.user })
	}

	@Post('refresh-token')
	@ApiOperation({ summary: 'refresh token' })
	@ApiOkResponse({ type: StaffSignInResponseDto })
	@UseInterceptors(RefreshTokenInterceptor)
	async getValidTokensWithRefresh(@Req() request: CRequest) {
		return this.authService.getValidTokens({ staff: request.user })
	}
}
