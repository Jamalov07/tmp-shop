import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ClientPaymentService } from './client-payment.service'
import { AuthOptions } from '@common'
import {
	ClientPaymentFindManyRequestDto,
	ClientPaymentCreateOneRequestDto,
	ClientPaymentUpdateOneRequestDto,
	ClientPaymentFindOneRequestDto,
	ClientPaymentFindManyResponseDto,
	ClientPaymentFindOneResponseDto,
	ClientPaymentModifyResponseDto,
	ClientPaymentCreateOneResponseDto,
} from './dtos'

@ApiTags('Client-payment')
@Controller('clientPayment')
export class ClientPaymentController {
	private readonly clientPaymentService: ClientPaymentService

	constructor(clientPaymentService: ClientPaymentService) {
		this.clientPaymentService = clientPaymentService
	}

	@Get('many')
	@ApiOkResponse({ type: ClientPaymentFindManyResponseDto })
	@ApiOperation({ summary: 'get all client payments' })
	@AuthOptions(false, false)
	async findMany(@Query() query: ClientPaymentFindManyRequestDto): Promise<ClientPaymentFindManyResponseDto> {
		return this.clientPaymentService.findMany(query)
	}

	@Get('one')
	@ApiOperation({ summary: 'find one client payment' })
	@ApiOkResponse({ type: ClientPaymentFindOneResponseDto })
	async getOne(@Query() query: ClientPaymentFindOneRequestDto): Promise<ClientPaymentFindOneResponseDto> {
		return this.clientPaymentService.findOne(query)
	}

	@Post('one')
	@ApiOperation({ summary: 'add one client payment' })
	@ApiOkResponse({ type: ClientPaymentCreateOneResponseDto })
	async createOne(@Body() body: ClientPaymentCreateOneRequestDto): Promise<ClientPaymentCreateOneResponseDto> {
		return this.clientPaymentService.createOne(body)
	}

	@Patch('one')
	@ApiOperation({ summary: 'update one client payment' })
	@ApiOkResponse({ type: ClientPaymentModifyResponseDto })
	async updateOne(@Query() query: ClientPaymentFindOneRequestDto, @Body() body: ClientPaymentUpdateOneRequestDto): Promise<ClientPaymentModifyResponseDto> {
		return this.clientPaymentService.updateOne(query, body)
	}

	@Delete('one')
	@ApiOperation({ summary: 'update one client payment' })
	@ApiOkResponse({ type: ClientPaymentModifyResponseDto })
	async deleteOne(@Query() query: ClientPaymentFindOneRequestDto): Promise<ClientPaymentModifyResponseDto> {
		return this.clientPaymentService.deleteOne(query)
	}
}
