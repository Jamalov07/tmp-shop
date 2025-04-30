import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger'
import { OrderProductFindManyData, OrderProductFindManyResponse, OrderProductFindOneData, OrderProductFindOneResponse, OrderProductModifyResposne } from '../interfaces'
import { GlobalModifyResponseDto, GlobalResponseDto, PaginationResponseDto } from '@common'
import { OrderProductRequiredDto } from './fields.dtos'

export class OrderProductFindOneDataDto extends PickType(OrderProductRequiredDto, ['id', 'createdAt']) implements OrderProductFindOneData {}

export class OrderProductFindManyDataDto extends PaginationResponseDto implements OrderProductFindManyData {
	@ApiProperty({ type: OrderProductFindOneDataDto, isArray: true })
	data: OrderProductFindOneData[]
}

export class OrderProductFindManyResponseDto extends GlobalResponseDto implements OrderProductFindManyResponse {
	@ApiProperty({ type: OrderProductFindManyDataDto })
	data: OrderProductFindManyData
}

export class OrderProductFindOneResponseDto extends GlobalResponseDto implements OrderProductFindOneResponse {
	@ApiProperty({ type: OrderProductFindOneDataDto })
	data: OrderProductFindOneData
}

export class OrderProductModifyResponseDto extends IntersectionType(GlobalResponseDto, GlobalModifyResponseDto) implements OrderProductModifyResposne {}
