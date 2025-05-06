import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { SupplierService } from './supplier.service'
import { AuthOptions } from '@common'
import {
	SupplierFindManyRequestDto,
	SupplierCreateOneRequestDto,
	SupplierUpdateOneRequestDto,
	SupplierFindOneRequestDto,
	SupplierFindManyResponseDto,
	SupplierFindOneResponseDto,
	SupplierModifyResponseDto,
	SupplierDeleteOneRequestDto,
	SupplierCreateOneResponseDto,
} from './dtos'

@ApiTags('Supplier')
@Controller('supplier')
export class SupplierController {
	private readonly supplierService: SupplierService
	constructor(supplierService: SupplierService) {
		this.supplierService = supplierService
	}

	@Get('many')
	@ApiOkResponse({ type: SupplierFindManyResponseDto })
	@ApiOperation({ summary: 'get all suppliers' })
	@AuthOptions(false, false)
	async findMany(@Query() query: SupplierFindManyRequestDto): Promise<SupplierFindManyResponseDto> {
		return this.supplierService.findMany(query)
	}

	@Get('one')
	@ApiOperation({ summary: 'find one supplier' })
	@ApiOkResponse({ type: SupplierFindOneResponseDto })
	async getOne(@Query() query: SupplierFindOneRequestDto): Promise<SupplierFindOneResponseDto> {
		return this.supplierService.findOne(query)
	}

	@Post('one')
	@ApiOperation({ summary: 'add one supplier' })
	@ApiOkResponse({ type: SupplierCreateOneResponseDto })
	async createOne(@Body() body: SupplierCreateOneRequestDto): Promise<SupplierCreateOneResponseDto> {
		return this.supplierService.createOne(body)
	}

	@Patch('one')
	@ApiOperation({ summary: 'update one supplier' })
	@ApiOkResponse({ type: SupplierModifyResponseDto })
	async updateOne(@Query() query: SupplierFindOneRequestDto, @Body() body: SupplierUpdateOneRequestDto): Promise<SupplierModifyResponseDto> {
		return this.supplierService.updateOne(query, body)
	}

	@Delete('one')
	@ApiOperation({ summary: 'delete one staff' })
	@ApiOkResponse({ type: SupplierModifyResponseDto })
	async deleteOne(@Query() query: SupplierDeleteOneRequestDto): Promise<SupplierModifyResponseDto> {
		return this.supplierService.deleteOne(query)
	}
}
