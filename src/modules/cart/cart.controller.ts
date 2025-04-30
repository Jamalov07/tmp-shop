import { Body, Controller, Delete, Get, Patch, Post, Query, Req } from '@nestjs/common'
import { CartService } from './cart.service'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { CartCreateOneRequestDto, CartDeleteOneRequestDto, CartFindManyRequestDto, CartFindOneRequestDto, CartUpdateOneRequestDto } from './dtos/request.dtos'
import { CartFindManyResponseDto, CartFindOneResponseDto, CartModifyResponseDto } from './dtos/response.dtos'
import { AuthOptions, CRequest } from '../../common'

@Controller('cart')
export class CartController {
	private readonly cartService: CartService
	constructor(cartService: CartService) {
		this.cartService = cartService
	}

	@Get('many')
	@ApiOkResponse({ type: CartFindManyResponseDto })
	@ApiOperation({ summary: 'get all carts' })
	async findMany(@Query() query: CartFindManyRequestDto): Promise<CartFindManyResponseDto> {
		return this.cartService.findMany(query)
	}

	@Get('my/many')
	@AuthOptions(true, true)
	@ApiOkResponse({ type: CartFindManyResponseDto })
	@ApiOperation({ summary: 'get all my carts' })
	async myCartFindMany(@Req() request: CRequest, @Query() query: CartFindManyRequestDto): Promise<CartFindManyResponseDto> {
		return this.cartService.findMany({ ...query, staffId: request.user.id })
	}

	@Get('one')
	@ApiOperation({ summary: 'find one cart' })
	@ApiOkResponse({ type: CartFindOneResponseDto })
	async findOne(@Query() query: CartFindOneRequestDto): Promise<CartFindOneResponseDto> {
		return this.cartService.findOne(query)
	}

	@Post('one')
	@AuthOptions(true, true)
	@ApiOperation({ summary: 'add one cart' })
	@ApiOkResponse({ type: CartModifyResponseDto })
	async createOne(@Req() request: CRequest, @Body() body: CartCreateOneRequestDto): Promise<CartModifyResponseDto> {
		return this.cartService.createOne(request, body)
	}

	@Patch('one')
	@ApiOperation({ summary: 'update one cart' })
	@ApiOkResponse({ type: CartModifyResponseDto })
	async updateOne(@Query() query: CartFindOneRequestDto, @Body() body: CartUpdateOneRequestDto): Promise<CartModifyResponseDto> {
		return this.cartService.updateOne(query, body)
	}

	@Delete('one')
	@ApiOperation({ summary: 'delete one cart' })
	@ApiOkResponse({ type: CartModifyResponseDto })
	async deleteOne(@Query() query: CartDeleteOneRequestDto): Promise<CartModifyResponseDto> {
		return this.cartService.deleteOne(query)
	}
}
