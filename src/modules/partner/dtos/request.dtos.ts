import { PickType, IntersectionType, ApiProperty } from '@nestjs/swagger'
import { PartnerCreateOneRequest, PartnerDeleteOneRequest, PartnerFindManyRequest, PartnerFindOneRequest, PartnerUpdateOneRequest } from '../interfaces'
import { PaginationRequestDto, RequestOtherFieldsDto } from '@common'
import { PartnerOptionalDto, PartnerRequiredDto } from './fields.dtos'
import { $Enums, PartnerRoleEnum } from '@prisma/client'
import { IsArray, IsEnum, IsOptional } from 'class-validator'

export class PartnerFindManyRequestDto
	extends IntersectionType(PickType(PartnerOptionalDto, ['fullname', 'phone', 'whereFrom']), PaginationRequestDto)
	implements PartnerFindManyRequest
{
	@ApiProperty({ enum: PartnerRoleEnum, isArray: true })
	@IsOptional()
	@IsArray()
	@IsEnum(PartnerRoleEnum, { each: true })
	roleNames?: $Enums.PartnerRoleEnum[]
}

export class PartnerFindOneRequestDto extends IntersectionType(PickType(PartnerRequiredDto, ['id'])) implements PartnerFindOneRequest {}

export class PartnerCreateOneRequestDto
	extends IntersectionType(PickType(PartnerRequiredDto, ['fullname', 'whereFrom', 'phone', 'password']), PickType(RequestOtherFieldsDto, ['rolesToConnect', 'actionsToConnect']))
	implements PartnerCreateOneRequest {}

export class PartnerUpdateOneRequestDto
	extends IntersectionType(
		PickType(PartnerOptionalDto, ['balance', 'deletedAt', 'fullname', 'password', 'phone', 'token', 'whereFrom']),
		PickType(RequestOtherFieldsDto, ['rolesToConnect', 'actionsToConnect', 'rolesToDisconnect', 'actionsToDisconnect']),
	)
	implements PartnerUpdateOneRequest {}

export class PartnerDeleteOneRequestDto extends IntersectionType(PickType(PartnerRequiredDto, ['id'])) implements PartnerDeleteOneRequest {}
