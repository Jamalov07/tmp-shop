import { PickType, IntersectionType } from '@nestjs/swagger'
import { ClientCreateOneRequest, ClientDeleteOneRequest, ClientFindManyRequest, ClientFindOneRequest, ClientUpdateOneRequest } from '../interfaces'
import { PaginationRequestDto, RequestOtherFieldsDto } from '@common'
import { ClientOptionalDto, ClientRequiredDto } from './fields.dtos'

export class ClientFindManyRequestDto
	extends IntersectionType(PickType(ClientOptionalDto, ['fullname', 'phone']), PaginationRequestDto, PickType(RequestOtherFieldsDto, ['search', 'isDeleted']))
	implements ClientFindManyRequest {}

export class ClientFindOneRequestDto extends IntersectionType(PickType(ClientRequiredDto, ['id'])) implements ClientFindOneRequest {}

export class ClientCreateOneRequestDto extends IntersectionType(PickType(ClientRequiredDto, ['phone', 'fullname'])) implements ClientCreateOneRequest {}

export class ClientUpdateOneRequestDto extends PickType(ClientOptionalDto, ['fullname', 'phone', 'deletedAt', 'balance']) implements ClientUpdateOneRequest {}

export class ClientDeleteOneRequestDto
	extends IntersectionType(PickType(ClientRequiredDto, ['id']), PickType(RequestOtherFieldsDto, ['method']))
	implements ClientDeleteOneRequest {}
