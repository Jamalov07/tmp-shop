import { PickType, IntersectionType, ApiProperty } from '@nestjs/swagger'
import { StaffCreateOneRequest, StaffDeleteOneRequest, StaffFindManyRequest, StaffFindOneRequest, StaffUpdateOneRequest } from '../interfaces'
import { PaginationRequestDto, RequestOtherFieldsDto } from '@common'
import { StaffOptionalDto, StaffRequiredDto } from './fields.dtos'
import { $Enums, StaffRoleEnum } from '@prisma/client'
import { IsArray, IsEnum, IsOptional } from 'class-validator'

export class StaffFindManyRequestDto
	extends IntersectionType(PickType(StaffOptionalDto, ['fullname', 'phone']), PaginationRequestDto, PickType(RequestOtherFieldsDto, ['search']))
	implements StaffFindManyRequest
{
	@ApiProperty({ enum: StaffRoleEnum, isArray: true })
	@IsOptional()
	@IsArray()
	@IsEnum(StaffRoleEnum, { each: true })
	roleNames?: $Enums.StaffRoleEnum[]
}

export class StaffFindOneRequestDto extends IntersectionType(PickType(StaffRequiredDto, ['id'])) implements StaffFindOneRequest {}

export class StaffCreateOneRequestDto
	extends IntersectionType(PickType(StaffRequiredDto, ['fullname', 'phone', 'password']), PickType(RequestOtherFieldsDto, ['actionsToConnect', 'rolesToConnect']))
	implements StaffCreateOneRequest {}

export class StaffUpdateOneRequestDto
	extends IntersectionType(
		PickType(StaffOptionalDto, ['deletedAt', 'fullname', 'password', 'phone', 'token']),
		PickType(RequestOtherFieldsDto, ['actionsToConnect', 'actionsToDisconnect', 'rolesToConnect', 'rolesToDisconnect']),
	)
	implements StaffUpdateOneRequest {}

export class StaffDeleteOneRequestDto extends IntersectionType(PickType(StaffRequiredDto, ['id'])) implements StaffDeleteOneRequest {}
