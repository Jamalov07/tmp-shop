import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { StaffPaymentService } from './staff-payment.service'
import {
	StaffPaymentFindManyRequestDto,
	StaffPaymentFindOneRequestDto,
	StaffPaymentFindManyResponseDto,
	StaffPaymentFindOneResponseDto,
	StaffPaymentModifyResponseDto,
	StaffPaymentUpdateOneRequestDto,
	StaffPaymentDeleteOneRequestDto,
	StaffPaymentCreateOneRequestDto,
	StaffPaymentCreateOneResponseDto,
} from './dtos'

@ApiTags('StaffPayment')
@Controller('staff-payment')
export class StaffPaymentController {
	private readonly staffPaymentService: StaffPaymentService

	constructor(staffPaymentService: StaffPaymentService) {
		this.staffPaymentService = staffPaymentService
	}

	@Get('many')
	@ApiOkResponse({ type: StaffPaymentFindManyResponseDto })
	@ApiOperation({ summary: 'get all staff payments' })
	async findMany(@Query() query: StaffPaymentFindManyRequestDto): Promise<StaffPaymentFindManyResponseDto> {
		return this.staffPaymentService.findMany(query)
	}

	@Get('one')
	@ApiOperation({ summary: 'find one staff payment' })
	@ApiOkResponse({ type: StaffPaymentFindOneResponseDto })
	async findOne(@Query() query: StaffPaymentFindOneRequestDto): Promise<StaffPaymentFindOneResponseDto> {
		return this.staffPaymentService.findOne(query)
	}

	@Post('one')
	@ApiOperation({ summary: 'create one staff payment' })
	@ApiOkResponse({ type: StaffPaymentCreateOneResponseDto })
	async createOne(@Body() body: StaffPaymentCreateOneRequestDto): Promise<StaffPaymentCreateOneResponseDto> {
		return this.staffPaymentService.createOne(body)
	}

	@Patch('one')
	@ApiOperation({ summary: 'update one staff payment' })
	@ApiOkResponse({ type: StaffPaymentModifyResponseDto })
	async updateOne(@Query() query: StaffPaymentFindOneRequestDto, @Body() body: StaffPaymentUpdateOneRequestDto): Promise<StaffPaymentModifyResponseDto> {
		return this.staffPaymentService.updateOne(query, body)
	}

	@Delete('one')
	@ApiOperation({ summary: 'delete one staff payment' })
	@ApiOkResponse({ type: StaffPaymentModifyResponseDto })
	async deleteOne(@Query() query: StaffPaymentDeleteOneRequestDto): Promise<StaffPaymentModifyResponseDto> {
		return this.staffPaymentService.deleteOne(query)
	}
}
