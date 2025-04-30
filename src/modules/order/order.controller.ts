import { Body, Controller, Delete, Get, Patch, Post, Query, Req } from '@nestjs/common'
import { OrderService } from './order.service'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import {
	OrderCreateOneRequestDto,
	OrderCreateOneWithPaymentProductRequestDto,
	OrderDeleteOneRequestDto,
	OrderFindManyRequestDto,
	OrderFindOneRequestDto,
	OrderUpdateOneRequestDto,
} from './dtos/request.dtos'
import { OrderFindManyResponseDto, OrderFindOneResponseDto, OrderModifyResponseDto } from './dtos/response.dtos'
import { AuthOptions, CRequest } from '../../common'

@Controller('order')
export class OrderController {
	private readonly orderService: OrderService
	constructor(orderService: OrderService) {
		this.orderService = orderService
	}

	@Get('many')
	@ApiOkResponse({ type: OrderFindManyResponseDto })
	@ApiOperation({ summary: 'get all orders' })
	async findMany(@Query() query: OrderFindManyRequestDto): Promise<OrderFindManyResponseDto> {
		return this.orderService.findMany(query)
	}

	@Get('one')
	@ApiOperation({ summary: 'find one order' })
	@ApiOkResponse({ type: OrderFindOneResponseDto })
	async findOne(@Query() query: OrderFindOneRequestDto): Promise<OrderFindOneResponseDto> {
		return this.orderService.findOne(query)
	}

	@Post('one')
	@ApiOperation({ summary: 'add one order' })
	@ApiOkResponse({ type: OrderModifyResponseDto })
	async createOne(@Body() body: OrderCreateOneRequestDto): Promise<OrderModifyResponseDto> {
		return this.orderService.createOne(body)
	}

	@Post('one-with-payment-product')
	@AuthOptions(true, true)
	@ApiOperation({ summary: 'add one order with payment product' })
	@ApiOkResponse({ type: OrderModifyResponseDto })
	async createOneWithPaymentProduct(@Req() user: CRequest, @Body() body: OrderCreateOneWithPaymentProductRequestDto): Promise<OrderModifyResponseDto> {
		return this.orderService.createOneWithPaymentProduct(user, body)
	}

	@Patch('one')
	@ApiOperation({ summary: 'update one order' })
	@ApiOkResponse({ type: OrderModifyResponseDto })
	async updateOne(@Query() query: OrderFindOneRequestDto, @Body() body: OrderUpdateOneRequestDto): Promise<OrderModifyResponseDto> {
		return this.orderService.updateOne(query, body)
	}

	@Delete('one')
	@ApiOperation({ summary: 'delete one order' })
	@ApiOkResponse({ type: OrderModifyResponseDto })
	async deleteOne(@Query() query: OrderDeleteOneRequestDto): Promise<OrderModifyResponseDto> {
		return this.orderService.deleteOne(query)
	}
}
