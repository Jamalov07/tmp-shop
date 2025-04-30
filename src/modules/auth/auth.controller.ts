import { Body, Controller, Post, Req, UseInterceptors } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthOptions, CRequest, RefreshTokenInterceptor } from '../../common'
import { AuthModifyResponseDto, UserSignInRequestDto, UserSignInResponseDto } from './dtos'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	private readonly authService: AuthService
	constructor(authService: AuthService) {
		this.authService = authService
	}

	@Post('sign-in')
	@ApiOperation({ summary: 'sign in user' })
	@ApiOkResponse({ type: UserSignInResponseDto })
	async signIn(@Body() body: UserSignInRequestDto): Promise<UserSignInResponseDto> {
		return this.authService.signIn(body)
	}

	@Post('sign-out')
	@AuthOptions(true, true)
	@ApiOperation({ summary: 'sign out user' })
	@ApiOkResponse({ type: AuthModifyResponseDto })
	async signOut(@Req() request: CRequest): Promise<AuthModifyResponseDto> {
		return this.authService.signOut({ user: request.user })
	}

	@Post('refresh-token')
	@ApiOperation({ summary: 'refresh token' })
	@ApiOkResponse({ type: UserSignInResponseDto })
	@UseInterceptors(RefreshTokenInterceptor)
	async getValidTokensWithRefresh(@Req() request: CRequest) {
		return this.authService.getValidTokens({ user: request.user })
	}
}
