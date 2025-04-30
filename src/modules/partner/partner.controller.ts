import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { PartnerService } from './partner.service'
import {
	PartnerFindManyRequestDto,
	PartnerFindOneRequestDto,
	PartnerFindManyResponseDto,
	PartnerFindOneResponseDto,
	PartnerModifyResponseDto,
	PartnerUpdateOneRequestDto,
	PartnerDeleteOneRequestDto,
	PartnerCreateOneRequestDto,
} from './dtos'

@ApiTags('Partner')
@Controller('partner')
export class PartnerController {
	private readonly partnerService: PartnerService

	constructor(partnerService: PartnerService) {
		this.partnerService = partnerService
	}

	@Get('many')
	@ApiOkResponse({ type: PartnerFindManyResponseDto })
	@ApiOperation({ summary: 'get all partners' })
	async findMany(@Query() query: PartnerFindManyRequestDto): Promise<PartnerFindManyResponseDto> {
		return this.partnerService.findMany(query)
	}

	@Get('provider/many')
	@ApiOkResponse({ type: PartnerFindManyResponseDto })
	@ApiOperation({ summary: 'get all providers' })
	async findManyProvider(@Query() query: PartnerFindManyRequestDto): Promise<PartnerFindManyResponseDto> {
		return this.partnerService.findManyProvider(query)
	}

	@Get('one')
	@ApiOperation({ summary: 'find one partner' })
	@ApiOkResponse({ type: PartnerFindOneResponseDto })
	async getOne(@Query() query: PartnerFindOneRequestDto): Promise<PartnerFindOneResponseDto> {
		return this.partnerService.findOne(query)
	}

	@Post('one')
	@ApiOperation({ summary: 'create one partner' })
	@ApiOkResponse({ type: PartnerModifyResponseDto })
	async createOne(@Body() body: PartnerCreateOneRequestDto): Promise<PartnerModifyResponseDto> {
		return this.partnerService.createOne(body)
	}

	@Patch('one')
	@ApiOperation({ summary: 'update one partner' })
	@ApiOkResponse({ type: PartnerModifyResponseDto })
	async updateOne(@Query() query: PartnerFindOneRequestDto, @Body() body: PartnerUpdateOneRequestDto): Promise<PartnerModifyResponseDto> {
		return this.partnerService.updateOne(query, body)
	}

	@Delete('one')
	@ApiOperation({ summary: 'delete one partner' })
	@ApiOkResponse({ type: PartnerModifyResponseDto })
	async deleteOne(@Query() query: PartnerDeleteOneRequestDto): Promise<PartnerModifyResponseDto> {
		return this.partnerService.deleteOne(query)
	}
}
