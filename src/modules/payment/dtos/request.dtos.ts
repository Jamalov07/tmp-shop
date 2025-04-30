import { IntersectionType, PickType } from '@nestjs/swagger'
import { PaymentCreateOneRequest, PaymentDeleteOneRequest, PaymentFindManyRequest, PaymentFindOneRequest, PaymentUpdateOneRequest } from '../interfaces'
import { PaginationRequestDto, RequestOtherFieldsDto } from '../../../common'
import { PaymentOptionalDto, PaymentRequiredDto } from './fields.dtos'

export class PaymentFindManyRequestDto
	extends IntersectionType(
		PaginationRequestDto,
		PickType(RequestOtherFieldsDto, ['ids', 'isDeleted']),
		PickType(PaymentOptionalDto, ['description', 'fromCurrency', 'method', 'orderId']),
	)
	implements PaymentFindManyRequest {}

export class PaymentFindOneRequestDto extends PickType(PaymentRequiredDto, ['id']) implements PaymentFindOneRequest {}

export class PaymentCreateOneRequestDto
	extends PickType(PaymentRequiredDto, ['description', 'exchangeRate', 'fromCurrency', 'method', 'orderId', 'sum', 'totalSum'])
	implements PaymentCreateOneRequest {}

export class PaymentUpdateOneRequestDto
	extends PickType(PaymentOptionalDto, ['description', 'exchangeRate', 'fromCurrency', 'method', 'orderId', 'sum', 'totalSum', 'deletedAt'])
	implements PaymentUpdateOneRequest {}

export class PaymentDeleteOneRequestDto
	extends IntersectionType(PickType(RequestOtherFieldsDto, ['isDeleted']), PickType(PaymentRequiredDto, ['id']))
	implements PaymentDeleteOneRequest {}
