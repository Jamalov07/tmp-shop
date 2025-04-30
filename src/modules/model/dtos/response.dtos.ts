import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger'
import { ModelFindManyData, ModelFindManyResponse, ModelFindOneData, ModelFindOneResponse, ModelModifyResposne } from '../interfaces'
import { GlobalModifyResponseDto, GlobalResponseDto, PaginationResponseDto } from '@common'
import { ModelRequiredDto } from './fields.dtos'
import { FurnitureTypeFindOneData, FurnitureTypeFindOneDataDto } from '../../furniture-type'
import { PartnerFindOneData, PartnerFindOneDataDto } from '../../partner'

export class ModelFindOneDataDto extends PickType(ModelRequiredDto, ['id', 'name', 'createdAt']) implements ModelFindOneData {
	@ApiProperty({ type: FurnitureTypeFindOneDataDto })
	furnitureType?: FurnitureTypeFindOneData

	@ApiProperty({ type: PartnerFindOneDataDto })
	provider?: PartnerFindOneData
}

export class ModelFindManyDataDto extends PaginationResponseDto implements ModelFindManyData {
	@ApiProperty({ type: ModelFindOneDataDto, isArray: true })
	data: ModelFindOneData[]
}

export class ModelFindManyResponseDto extends GlobalResponseDto implements ModelFindManyResponse {
	@ApiProperty({ type: ModelFindManyDataDto })
	data: ModelFindManyData
}

export class ModelFindOneResponseDto extends GlobalResponseDto implements ModelFindOneResponse {
	@ApiProperty({ type: ModelFindOneDataDto })
	data: ModelFindOneData
}

export class ModelModifyResponseDto extends IntersectionType(GlobalResponseDto, GlobalModifyResponseDto) implements ModelModifyResposne {}
