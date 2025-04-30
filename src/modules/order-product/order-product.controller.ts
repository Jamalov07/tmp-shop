import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common'
import { OrderProductService } from './order-product.service'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import {
	OrderProductCreateOneRequestDto,
	OrderProductDeleteOneRequestDto,
	OrderProductFindManyRequestDto,
	OrderProductFindOneRequestDto,
	OrderProductUpdateOneRequestDto,
} from './dtos/request.dtos'
import { OrderProductFindManyResponseDto, OrderProductFindOneResponseDto, OrderProductModifyResponseDto } from './dtos/response.dtos'

@Controller('order-product')
export class OrderProductController {
	private readonly orderProductService: OrderProductService
	constructor(orderProductService: OrderProductService) {
		this.orderProductService = orderProductService
	}

	@Get('many')
	@ApiOkResponse({ type: OrderProductFindManyResponseDto })
	@ApiOperation({ summary: 'get all orderProducts' })
	async findMany(@Query() query: OrderProductFindManyRequestDto): Promise<OrderProductFindManyResponseDto> {
		return this.orderProductService.findMany(query)
	}

	@Get('one')
	@ApiOperation({ summary: 'find one orderProduct' })
	@ApiOkResponse({ type: OrderProductFindOneResponseDto })
	async findOne(@Query() query: OrderProductFindOneRequestDto): Promise<OrderProductFindOneResponseDto> {
		return this.orderProductService.findOne(query)
	}

	@Post('one')
	@ApiOperation({ summary: 'add one orderProduct' })
	@ApiOkResponse({ type: OrderProductModifyResponseDto })
	async createOne(@Body() body: OrderProductCreateOneRequestDto): Promise<OrderProductModifyResponseDto> {
		return this.orderProductService.createOne(body)
	}

	@Patch('one')
	@ApiOperation({ summary: 'update one orderProduct' })
	@ApiOkResponse({ type: OrderProductModifyResponseDto })
	async updateOne(@Query() query: OrderProductFindOneRequestDto, @Body() body: OrderProductUpdateOneRequestDto): Promise<OrderProductModifyResponseDto> {
		return this.orderProductService.updateOne(query, body)
	}

	@Delete('one')
	@ApiOperation({ summary: 'delete one orderProduct' })
	@ApiOkResponse({ type: OrderProductModifyResponseDto })
	async deleteOne(@Query() query: OrderProductDeleteOneRequestDto): Promise<OrderProductModifyResponseDto> {
		return this.orderProductService.deleteOne(query)
	}
}
