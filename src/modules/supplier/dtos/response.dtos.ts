import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger'
import { SupplierCreateOneResponse, SupplierFindManyData, SupplierFindOneData, SupplierFindOneResponse, SupplierModifyResposne } from '../interfaces'
import { GlobalModifyResponseDto, GlobalResponseDto, PaginationResponseDto } from '@common'
import { SupplierRequiredDto } from './fields.dtos'

export class SupplierFindOneDataDto extends PickType(SupplierRequiredDto, ['id', 'phone', 'fullname', 'createdAt', 'balance']) implements SupplierFindOneData {}

export class SupplierFindManyDataDto extends PaginationResponseDto implements SupplierFindManyData {
	@ApiProperty({ type: SupplierFindOneDataDto, isArray: true })
	data: SupplierFindOneData[]
}

export class SupplierFindManyResponseDto extends GlobalResponseDto implements SupplierFindManyResponseDto {
	@ApiProperty({ type: SupplierFindManyDataDto })
	data: SupplierFindManyData | { data: SupplierFindOneData[] }
}

export class SupplierFindOneResponseDto extends GlobalResponseDto implements SupplierFindOneResponse {
	@ApiProperty({ type: SupplierFindOneDataDto })
	data: SupplierFindOneData
}

export class SupplierCreateOneResponseDto extends GlobalResponseDto implements SupplierCreateOneResponse {
	@ApiProperty({ type: SupplierFindOneDataDto })
	data: SupplierFindOneData
}

export class SupplierModifyResponseDto extends IntersectionType(GlobalResponseDto, GlobalModifyResponseDto) implements SupplierModifyResposne {}
