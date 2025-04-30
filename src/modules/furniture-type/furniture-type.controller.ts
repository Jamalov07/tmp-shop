import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common'
import { FurnitureTypeService } from './furniture-type.service'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import {
	FurnitureTypeCreateOneRequestDto,
	FurnitureTypeDeleteOneRequestDto,
	FurnitureTypeFindManyRequestDto,
	FurnitureTypeFindOneRequestDto,
	FurnitureTypeUpdateOneRequestDto,
} from './dtos/request.dtos'
import { FurnitureTypeFindManyResponseDto, FurnitureTypeFindOneResponseDto, FurnitureTypeModifyResponseDto } from './dtos/response.dtos'

@Controller('furniture-type')
export class FurnitureTypeController {
	private readonly furnitureTypeService: FurnitureTypeService
	constructor(furnitureTypeService: FurnitureTypeService) {
		this.furnitureTypeService = furnitureTypeService
	}

	@Get('many')
	@ApiOkResponse({ type: FurnitureTypeFindManyResponseDto })
	@ApiOperation({ summary: 'get all furniture types' })
	async findMany(@Query() query: FurnitureTypeFindManyRequestDto): Promise<FurnitureTypeFindManyResponseDto> {
		return this.furnitureTypeService.findMany(query)
	}

	@Get('one')
	@ApiOperation({ summary: 'find one furniture type' })
	@ApiOkResponse({ type: FurnitureTypeFindOneResponseDto })
	async findOne(@Query() query: FurnitureTypeFindOneRequestDto): Promise<FurnitureTypeFindOneResponseDto> {
		return this.furnitureTypeService.findOne(query)
	}

	@Post('one')
	@ApiOperation({ summary: 'add one furniture type' })
	@ApiOkResponse({ type: FurnitureTypeModifyResponseDto })
	async createOne(@Body() body: FurnitureTypeCreateOneRequestDto): Promise<FurnitureTypeModifyResponseDto> {
		return this.furnitureTypeService.createOne(body)
	}

	@Patch('one')
	@ApiOperation({ summary: 'update one furniture type' })
	@ApiOkResponse({ type: FurnitureTypeModifyResponseDto })
	async updateOne(@Query() query: FurnitureTypeFindOneRequestDto, @Body() body: FurnitureTypeUpdateOneRequestDto): Promise<FurnitureTypeModifyResponseDto> {
		return this.furnitureTypeService.updateOne(query, body)
	}

	@Delete('one')
	@ApiOperation({ summary: 'delete one furniture type' })
	@ApiOkResponse({ type: FurnitureTypeModifyResponseDto })
	async deleteOne(@Query() query: FurnitureTypeDeleteOneRequestDto): Promise<FurnitureTypeModifyResponseDto> {
		return this.furnitureTypeService.deleteOne(query)
	}
}
