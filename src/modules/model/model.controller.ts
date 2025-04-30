import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common'
import { ModelService } from './model.service'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { ModelCreateOneRequestDto, ModelDeleteOneRequestDto, ModelFindManyRequestDto, ModelFindOneRequestDto, ModelUpdateOneRequestDto } from './dtos/request.dtos'
import { ModelFindManyResponseDto, ModelFindOneResponseDto, ModelModifyResponseDto } from './dtos/response.dtos'

@Controller('model')
export class ModelController {
	private readonly modelService: ModelService
	constructor(modelService: ModelService) {
		this.modelService = modelService
	}

	@Get('many')
	@ApiOkResponse({ type: ModelFindManyResponseDto })
	@ApiOperation({ summary: 'get all models' })
	async findMany(@Query() query: ModelFindManyRequestDto): Promise<ModelFindManyResponseDto> {
		return this.modelService.findMany(query)
	}

	@Get('one')
	@ApiOperation({ summary: 'find one model' })
	@ApiOkResponse({ type: ModelFindOneResponseDto })
	async findOne(@Query() query: ModelFindOneRequestDto): Promise<ModelFindOneResponseDto> {
		return this.modelService.findOne(query)
	}

	@Post('one')
	@ApiOperation({ summary: 'add one model' })
	@ApiOkResponse({ type: ModelModifyResponseDto })
	async createOne(@Body() body: ModelCreateOneRequestDto): Promise<ModelModifyResponseDto> {
		return this.modelService.createOne(body)
	}

	@Patch('one')
	@ApiOperation({ summary: 'update one model' })
	@ApiOkResponse({ type: ModelModifyResponseDto })
	async updateOne(@Query() query: ModelFindOneRequestDto, @Body() body: ModelUpdateOneRequestDto): Promise<ModelModifyResponseDto> {
		return this.modelService.updateOne(query, body)
	}

	@Delete('one')
	@ApiOperation({ summary: 'delete one model' })
	@ApiOkResponse({ type: ModelModifyResponseDto })
	async deleteOne(@Query() query: ModelDeleteOneRequestDto): Promise<ModelModifyResponseDto> {
		return this.modelService.deleteOne(query)
	}
}
