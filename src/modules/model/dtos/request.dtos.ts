import { IntersectionType, PickType } from '@nestjs/swagger'
import { ModelCreateOneRequest, ModelDeleteOneRequest, ModelFindManyRequest, ModelFindOneRequest, ModelUpdateOneRequest } from '../interfaces'
import { PaginationRequestDto, RequestOtherFieldsDto } from '../../../common'
import { ModelOptionalDto, ModelRequiredDto } from './fields.dtos'

export class ModelFindManyRequestDto
	extends IntersectionType(PaginationRequestDto, PickType(RequestOtherFieldsDto, ['ids', 'isDeleted']), PickType(ModelOptionalDto, ['name', 'furnitureTypeId', 'providerId']))
	implements ModelFindManyRequest {}

export class ModelFindOneRequestDto extends PickType(ModelRequiredDto, ['id']) implements ModelFindOneRequest {}

export class ModelCreateOneRequestDto extends PickType(ModelRequiredDto, ['name', 'furnitureTypeId', 'providerId']) implements ModelCreateOneRequest {}

export class ModelUpdateOneRequestDto extends PickType(ModelOptionalDto, ['name', 'deletedAt', 'furnitureTypeId', 'providerId']) implements ModelUpdateOneRequest {}

export class ModelDeleteOneRequestDto
	extends IntersectionType(PickType(RequestOtherFieldsDto, ['isDeleted']), PickType(ModelRequiredDto, ['id']))
	implements ModelDeleteOneRequest {}
