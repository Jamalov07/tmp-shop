import { Controller, Get, Query, Req } from '@nestjs/common'
import { PublicIdService } from './public-id.service'
import { CRequest } from '../../common/interfaces'
import { AuthOptions } from '../../common'
import { PublicIdGenerateResponseDto, PublicIdSearchRequestDto, PublicIdSearchResponseDto } from './dtos'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Public Id')
@Controller('public-id')
export class PublicIdController {
	private readonly publicIdService: PublicIdService
	constructor(publicIdService: PublicIdService) {
		this.publicIdService = publicIdService
	}
	@Get('search')
	@AuthOptions(true, true)
	@ApiOkResponse({ type: PublicIdSearchResponseDto })
	@ApiOperation({ summary: 'search public id' })
	async search(@Req() request: CRequest, @Query() query: PublicIdSearchRequestDto): Promise<PublicIdSearchResponseDto> {
		return this.publicIdService.search(request, query)
	}

	@Get('generate')
	@AuthOptions(true, true)
	@ApiOkResponse({ type: PublicIdGenerateResponseDto })
	@ApiOperation({ summary: 'generate public id' })
	async generate(@Req() request: CRequest): Promise<PublicIdGenerateResponseDto> {
		return this.publicIdService.generate(request)
	}
}
