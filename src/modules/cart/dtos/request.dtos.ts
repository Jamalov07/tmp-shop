import { IntersectionType, PickType } from '@nestjs/swagger'
import { CartCreateOneRequest, CartDeleteOneRequest, CartFindManyRequest, CartFindOneRequest, CartUpdateOneRequest } from '../interfaces'
import { PaginationRequestDto, RequestOtherFieldsDto } from '../../../common'
import { CartOptionalDto, CartRequiredDto } from './fields.dtos'

export class CartFindManyRequestDto
	extends IntersectionType(
		PaginationRequestDto,
		PickType(RequestOtherFieldsDto, ['ids', 'isDeleted']),
		PickType(CartOptionalDto, ['description', 'modelId', 'direction', 'publicId', 'staffId', 'tissue', 'totalSum']),
	)
	implements CartFindManyRequest {}

export class CartFindOneRequestDto extends PickType(CartRequiredDto, ['id']) implements CartFindOneRequest {}

export class CartCreateOneRequestDto
	extends PickType(CartRequiredDto, ['description', 'modelId', 'price', 'direction', 'priceWithSale', 'publicId', 'quantity', 'sale', 'tissue', 'totalSum'])
	implements CartCreateOneRequest {}

export class CartUpdateOneRequestDto
	extends PickType(CartOptionalDto, ['description', 'modelId', 'price', 'direction', 'priceWithSale', 'publicId', 'quantity', 'sale', 'staffId', 'tissue', 'totalSum', 'deletedAt'])
	implements CartUpdateOneRequest {}

export class CartDeleteOneRequestDto extends IntersectionType(PickType(RequestOtherFieldsDto, ['isDeleted']), PickType(CartRequiredDto, ['id'])) implements CartDeleteOneRequest {}
