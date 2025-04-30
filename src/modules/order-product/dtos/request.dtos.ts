import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger'
import { OrderProductCreateOneRequest, OrderProductDeleteOneRequest, OrderProductFindManyRequest, OrderProductFindOneRequest, OrderProductUpdateOneRequest } from '../interfaces'
import { PaginationRequestDto, RequestOtherFieldsDto } from '../../../common'
import { OrderProductOptionalDto, OrderProductRequiredDto } from './fields.dtos'
import { IsOptional, IsUUID } from 'class-validator'

export class OrderProductFindManyRequestDto
	extends IntersectionType(
		PaginationRequestDto,
		PickType(RequestOtherFieldsDto, ['ids', 'isDeleted']),
		PickType(OrderProductOptionalDto, ['description', 'modelId', 'orderId', 'direction', 'publicId', 'tissue', 'totalSum']),
	)
	implements OrderProductFindManyRequest
{
	@ApiProperty({ type: String })
	@IsOptional()
	@IsUUID('4')
	modelProviderId?: string
}

export class OrderProductFindOneRequestDto extends PickType(OrderProductRequiredDto, ['id']) implements OrderProductFindOneRequest {}

export class OrderProductCreateOneRequestDto
	extends PickType(OrderProductRequiredDto, ['description', 'orderId', 'modelId', 'price', 'direction', 'priceWithSale', 'publicId', 'quantity', 'sale', 'tissue', 'totalSum'])
	implements OrderProductCreateOneRequest {}

export class OrderProductUpdateOneRequestDto
	extends PickType(OrderProductOptionalDto, [
		'description',
		'modelId',
		'price',
		'direction',
		'priceWithSale',
		'publicId',
		'quantity',
		'sale',
		'tissue',
		'totalSum',
		'deletedAt',
		'orderId',
		'status',
	])
	implements OrderProductUpdateOneRequest {}

export class OrderProductDeleteOneRequestDto
	extends IntersectionType(PickType(RequestOtherFieldsDto, ['isDeleted']), PickType(OrderProductRequiredDto, ['id']))
	implements OrderProductDeleteOneRequest {}
