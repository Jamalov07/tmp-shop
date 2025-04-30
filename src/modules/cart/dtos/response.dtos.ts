import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger'
import { CartFindManyData, CartFindManyResponse, CartFindOneData, CartFindOneResponse, CartModifyResposne } from '../interfaces'
import { GlobalModifyResponseDto, GlobalResponseDto, PaginationResponseDto } from '@common'
import { CartRequiredDto } from './fields.dtos'

export class CartFindOneDataDto extends PickType(CartRequiredDto, ['id', 'createdAt']) implements CartFindOneData {}

export class CartFindManyDataDto extends PaginationResponseDto implements CartFindManyData {
	@ApiProperty({ type: CartFindOneDataDto, isArray: true })
	data: CartFindOneData[]
}

export class CartFindManyResponseDto extends GlobalResponseDto implements CartFindManyResponse {
	@ApiProperty({ type: CartFindManyDataDto })
	data: CartFindManyData
}

export class CartFindOneResponseDto extends GlobalResponseDto implements CartFindOneResponse {
	@ApiProperty({ type: CartFindOneDataDto })
	data: CartFindOneData
}

export class CartModifyResponseDto extends IntersectionType(GlobalResponseDto, GlobalModifyResponseDto) implements CartModifyResposne {}
