import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common'
import { ProductMVService } from './product-mv.service'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import {
	arrivalProductMVCreateOneRequestDto,
	ArrivalProductMVUpdateOneRequestDto,
	ProductMVDeleteOneRequestDto,
	ProductMVFindManyRequestDto,
	ProductMVFindManyResponseDto,
	ProductMVFindOneRequestDto,
	ProductMVFindOneResponseDto,
	ReturningProductMVCreateOneRequestDto,
	ReturningProductMVUpdateOneRequestDto,
	SellingProductMVCreateOneRequestDto,
	SellingProductMVUpdateOneRequestDto,
} from './dtos'
import { AuthOptions } from '../../common'
import { ProductModifyResponseDto } from '../product/dtos'

@Controller('product-mv')
export class ProductMVController {
	private readonly productMVService: ProductMVService
	constructor(productMVService: ProductMVService) {
		this.productMVService = productMVService
	}

	@Get('many')
	@ApiOkResponse({ type: ProductMVFindManyResponseDto })
	@ApiOperation({ summary: 'get all products' })
	@AuthOptions(false, false)
	async findMany(@Query() query: ProductMVFindManyRequestDto): Promise<ProductMVFindManyResponseDto> {
		return this.productMVService.findMany({ ...query, isDeleted: false })
	}

	@Get('one')
	@ApiOperation({ summary: 'find one product' })
	@ApiOkResponse({ type: ProductMVFindOneResponseDto })
	async getOne(@Query() query: ProductMVFindOneRequestDto): Promise<ProductMVFindOneResponseDto> {
		return this.productMVService.findOne(query)
	}

	@Post('selling/one')
	@ApiOperation({ summary: 'add one selling product' })
	@ApiOkResponse({ type: ProductModifyResponseDto })
	async createOneSelling(@Body() body: SellingProductMVCreateOneRequestDto): Promise<ProductModifyResponseDto> {
		return this.productMVService.createOneSelling(body)
	}

	@Post('arrival/one')
	@ApiOperation({ summary: 'add one arrival product' })
	@ApiOkResponse({ type: ProductModifyResponseDto })
	async createOneArrival(@Body() body: arrivalProductMVCreateOneRequestDto): Promise<ProductModifyResponseDto> {
		return this.productMVService.createOneArrival(body)
	}

	@Post('returning/one')
	@ApiOperation({ summary: 'add one returning product' })
	@ApiOkResponse({ type: ProductModifyResponseDto })
	async createOneReturning(@Body() body: ReturningProductMVCreateOneRequestDto): Promise<ProductModifyResponseDto> {
		return this.productMVService.createOneReturning(body)
	}

	@Patch('selling/one')
	@ApiOperation({ summary: 'update one selling product' })
	@ApiOkResponse({ type: ProductModifyResponseDto })
	async updateOneSelling(@Query() query: ProductMVFindOneRequestDto, @Body() body: SellingProductMVUpdateOneRequestDto): Promise<ProductModifyResponseDto> {
		return this.productMVService.updateOneSelling(query, body)
	}

	@Patch('arival/one')
	@ApiOperation({ summary: 'update one arrival product' })
	@ApiOkResponse({ type: ProductModifyResponseDto })
	async updateOneArrival(@Query() query: ProductMVFindOneRequestDto, @Body() body: ArrivalProductMVUpdateOneRequestDto): Promise<ProductModifyResponseDto> {
		return this.productMVService.updateOneArrival(query, body)
	}

	@Patch('returning/one')
	@ApiOperation({ summary: 'update one returning product' })
	@ApiOkResponse({ type: ProductModifyResponseDto })
	async updateOneReturning(@Query() query: ProductMVFindOneRequestDto, @Body() body: ReturningProductMVUpdateOneRequestDto): Promise<ProductModifyResponseDto> {
		return this.productMVService.updateOneReturning(query, body)
	}

	@Delete('one')
	@ApiOperation({ summary: 'update one product' })
	@ApiOkResponse({ type: ProductModifyResponseDto })
	async deleteOne(@Query() query: ProductMVDeleteOneRequestDto): Promise<ProductModifyResponseDto> {
		return this.productMVService.deleteOne(query)
	}
}
