import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger'
import {
	PartnerRoleFindManyData,
	PartnerRoleFindManyResponse,
	PartnerRoleFindOneData,
	PartnerRoleFindOneResponse,
	PartnerRoleModifyResposne,
	StaffRoleFindManyData,
	StaffRoleFindManyResponse,
	StaffRoleFindOneData,
	StaffRoleFindOneResponse,
	StaffRoleModifyResposne,
} from '../interfaces'
import { GlobalModifyResponseDto, GlobalResponseDto, PaginationResponseDto } from '@common'
import { PartnerRoleRequiredDto, StaffRoleRequiredDto } from './fields.dtos'

export class StaffRoleFindOneDataDto extends PickType(StaffRoleRequiredDto, ['id', 'name', 'createdAt']) implements StaffRoleFindOneData {}

export class StaffRoleFindManyDataDto extends PaginationResponseDto implements StaffRoleFindManyData {
	@ApiProperty({ type: StaffRoleFindOneDataDto, isArray: true })
	data: StaffRoleFindOneData[]
}

export class StaffRoleFindManyResponseDto extends GlobalResponseDto implements StaffRoleFindManyResponse {
	@ApiProperty({ type: StaffRoleFindManyDataDto })
	data: StaffRoleFindManyData
}

export class StaffRoleFindOneResponseDto extends GlobalResponseDto implements StaffRoleFindOneResponse {
	@ApiProperty({ type: StaffRoleFindOneDataDto })
	data: StaffRoleFindOneData
}

export class StaffRoleModifyResponseDto extends IntersectionType(GlobalResponseDto, GlobalModifyResponseDto) implements StaffRoleModifyResposne {}

//===//

export class PartnerRoleFindOneDataDto extends PickType(PartnerRoleRequiredDto, ['id', 'name', 'createdAt']) implements PartnerRoleFindOneData {}

export class PartnerRoleFindManyDataDto extends PaginationResponseDto implements PartnerRoleFindManyData {
	@ApiProperty({ type: PartnerRoleFindOneDataDto, isArray: true })
	data: PartnerRoleFindOneData[]
}

export class PartnerRoleFindManyResponseDto extends GlobalResponseDto implements PartnerRoleFindManyResponse {
	@ApiProperty({ type: PartnerRoleFindManyDataDto })
	data: PartnerRoleFindManyData
}

export class PartnerRoleFindOneResponseDto extends GlobalResponseDto implements PartnerRoleFindOneResponse {
	@ApiProperty({ type: PartnerRoleFindOneDataDto })
	data: PartnerRoleFindOneData
}

export class PartnerRoleModifyResponseDto extends IntersectionType(GlobalResponseDto, GlobalModifyResponseDto) implements PartnerRoleModifyResposne {}
