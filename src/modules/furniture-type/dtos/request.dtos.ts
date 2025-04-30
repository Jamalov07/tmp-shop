import { IntersectionType, PickType } from '@nestjs/swagger'
import {
	FurnitureTypeCreateOneRequest,
	FurnitureTypeDeleteOneRequest,
	FurnitureTypeFindManyRequest,
	FurnitureTypeFindOneRequest,
	FurnitureTypeUpdateOneRequest,
} from '../interfaces'
import { PaginationRequestDto, RequestOtherFieldsDto } from '../../../common'
import { FurnitureTypeOptionalDto, FurnitureTypeRequiredDto } from './fields.dtos'

export class FurnitureTypeFindManyRequestDto
	extends IntersectionType(PaginationRequestDto, PickType(RequestOtherFieldsDto, ['ids', 'isDeleted']), PickType(FurnitureTypeOptionalDto, ['name']))
	implements FurnitureTypeFindManyRequest {}

export class FurnitureTypeFindOneRequestDto extends PickType(FurnitureTypeRequiredDto, ['id']) implements FurnitureTypeFindOneRequest {}

export class FurnitureTypeCreateOneRequestDto extends PickType(FurnitureTypeRequiredDto, ['name']) implements FurnitureTypeCreateOneRequest {}

export class FurnitureTypeUpdateOneRequestDto extends PickType(FurnitureTypeOptionalDto, ['name', 'deletedAt']) implements FurnitureTypeUpdateOneRequest {}

export class FurnitureTypeDeleteOneRequestDto
	extends IntersectionType(PickType(RequestOtherFieldsDto, ['isDeleted']), PickType(FurnitureTypeRequiredDto, ['id']))
	implements FurnitureTypeDeleteOneRequest {}
