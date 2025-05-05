import { PickType, IntersectionType } from '@nestjs/swagger'
import {
	ClientPaymentCreateOneRequest,
	ClientPaymentDeleteOneRequest,
	ClientPaymentFindManyRequest,
	ClientPaymentFindOneRequest,
	ClientPaymentUpdateOneRequest,
} from '../interfaces'
import { PaginationRequestDto, RequestOtherFieldsDto } from '@common'
import { ClientPaymentOptionalDto, ClientPaymentRequiredDto } from './fields.dtos'

export class ClientPaymentFindManyRequestDto
	extends IntersectionType(PickType(ClientPaymentOptionalDto, ['description', 'clientId']), PaginationRequestDto)
	implements ClientPaymentFindManyRequest {}

export class ClientPaymentFindOneRequestDto extends IntersectionType(PickType(ClientPaymentRequiredDto, ['id'])) implements ClientPaymentFindOneRequest {}

export class ClientPaymentCreateOneRequestDto
	extends IntersectionType(PickType(ClientPaymentRequiredDto, ['card', 'cash', 'clientId', 'description', 'other', 'transfer']))
	implements ClientPaymentCreateOneRequest {}

export class ClientPaymentUpdateOneRequestDto
	extends IntersectionType(PickType(ClientPaymentOptionalDto, ['card', 'cash', 'clientId', 'description', 'other', 'transfer']))
	implements ClientPaymentUpdateOneRequest {}

export class ClientPaymentDeleteOneRequestDto
	extends IntersectionType(PickType(ClientPaymentRequiredDto, ['id']), PickType(RequestOtherFieldsDto, ['method']))
	implements ClientPaymentDeleteOneRequest {}
