import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common'
import { PaymentService } from './payment.service'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { PaymentCreateOneRequestDto, PaymentDeleteOneRequestDto, PaymentFindManyRequestDto, PaymentFindOneRequestDto, PaymentUpdateOneRequestDto } from './dtos/request.dtos'
import { PaymentFindManyResponseDto, PaymentFindOneResponseDto, PaymentModifyResponseDto } from './dtos/response.dtos'

@Controller('payment')
export class PaymentController {
	private readonly paymentService: PaymentService
	constructor(paymentService: PaymentService) {
		this.paymentService = paymentService
	}

	@Get('many')
	@ApiOkResponse({ type: PaymentFindManyResponseDto })
	@ApiOperation({ summary: 'get all payments' })
	async findMany(@Query() query: PaymentFindManyRequestDto): Promise<PaymentFindManyResponseDto> {
		return this.paymentService.findMany(query)
	}

	@Get('one')
	@ApiOperation({ summary: 'find one payment' })
	@ApiOkResponse({ type: PaymentFindOneResponseDto })
	async findOne(@Query() query: PaymentFindOneRequestDto): Promise<PaymentFindOneResponseDto> {
		return this.paymentService.findOne(query)
	}

	@Post('one')
	@ApiOperation({ summary: 'add one payment' })
	@ApiOkResponse({ type: PaymentModifyResponseDto })
	async createOne(@Body() body: PaymentCreateOneRequestDto): Promise<PaymentModifyResponseDto> {
		return this.paymentService.createOne(body)
	}

	@Patch('one')
	@ApiOperation({ summary: 'update one payment' })
	@ApiOkResponse({ type: PaymentModifyResponseDto })
	async updateOne(@Query() query: PaymentFindOneRequestDto, @Body() body: PaymentUpdateOneRequestDto): Promise<PaymentModifyResponseDto> {
		return this.paymentService.updateOne(query, body)
	}

	@Delete('one')
	@ApiOperation({ summary: 'delete one payment' })
	@ApiOkResponse({ type: PaymentModifyResponseDto })
	async deleteOne(@Query() query: PaymentDeleteOneRequestDto): Promise<PaymentModifyResponseDto> {
		return this.paymentService.deleteOne(query)
	}
}
