import { PickType, IntersectionType } from '@nestjs/swagger'
import { SupplierCreateOneRequest, SupplierDeleteOneRequest, SupplierFindManyRequest, SupplierFindOneRequest, SupplierUpdateOneRequest } from '../interfaces'
import { PaginationRequestDto, RequestOtherFieldsDto } from '@common'
import { SupplierOptionalDto, SupplierRequiredDto } from './fields.dtos'

export class SupplierFindManyRequestDto
	extends IntersectionType(PickType(SupplierOptionalDto, ['fullname', 'phone']), PaginationRequestDto, PickType(RequestOtherFieldsDto, ['search', 'isDeleted']))
	implements SupplierFindManyRequest {}

export class SupplierFindOneRequestDto extends IntersectionType(PickType(SupplierRequiredDto, ['id'])) implements SupplierFindOneRequest {}

export class SupplierCreateOneRequestDto extends IntersectionType(PickType(SupplierRequiredDto, ['phone', 'fullname'])) implements SupplierCreateOneRequest {}

export class SupplierUpdateOneRequestDto extends PickType(SupplierOptionalDto, ['fullname', 'phone', 'deletedAt', 'balance']) implements SupplierUpdateOneRequest {}

export class SupplierDeleteOneRequestDto
	extends IntersectionType(PickType(SupplierRequiredDto, ['id']), PickType(RequestOtherFieldsDto, ['method']))
	implements SupplierDeleteOneRequest {}
