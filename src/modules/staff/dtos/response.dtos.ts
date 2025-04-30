import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger'
import { StaffFindManyData, StaffFindManyResponse, StaffFindOneData, StaffFindOneResponse, StaffModifyResposne } from '../interfaces'
import { GlobalModifyResponseDto, GlobalResponseDto, PaginationResponseDto } from '@common'
import { StaffRequiredDto } from './fields.dtos'
import { StaffRoleFindOneData, StaffRoleFindOneDataDto } from '../../role'

export class StaffFindOneDataDto extends PickType(StaffRequiredDto, ['id', 'fullname', 'createdAt']) implements StaffFindOneData {
	@ApiProperty({ type: String, isArray: true })
	actionIds?: string[]

	@ApiProperty({ type: StaffRoleFindOneDataDto, isArray: true })
	roles?: StaffRoleFindOneData[]
}

export class StaffFindManyDataDto extends PaginationResponseDto implements StaffFindManyData {
	@ApiProperty({ type: StaffFindOneDataDto, isArray: true })
	data: StaffFindOneData[]
}

export class StaffFindManyResponseDto extends GlobalResponseDto implements StaffFindManyResponse {
	@ApiProperty({ type: StaffFindManyDataDto })
	data: StaffFindManyData
}

export class StaffFindOneResponseDto extends GlobalResponseDto implements StaffFindOneResponse {
	@ApiProperty({ type: StaffFindOneDataDto })
	data: StaffFindOneData
}

export class StaffModifyResponseDto extends IntersectionType(GlobalResponseDto, GlobalModifyResponseDto) implements StaffModifyResposne {}
