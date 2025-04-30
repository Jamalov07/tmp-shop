import { PickType, IntersectionType } from '@nestjs/swagger'
import {
	PartnerRoleDeleteOneRequest,
	PartnerRoleFindManyRequest,
	PartnerRoleFindOneRequest,
	PartnerRoleUpdateOneRequest,
	StaffRoleDeleteOneRequest,
	StaffRoleFindManyRequest,
	StaffRoleFindOneRequest,
	StaffRoleUpdateOneRequest,
} from '../interfaces'
import { PaginationRequestDto, RequestOtherFieldsDto } from '@common'
import { PartnerRoleOptionalDto, PartnerRoleRequiredDto, StaffRoleOptionalDto, StaffRoleRequiredDto } from './fields.dtos'

export class StaffRoleFindManyRequestDto extends IntersectionType(PickType(StaffRoleOptionalDto, ['name']), PaginationRequestDto) implements StaffRoleFindManyRequest {}

export class StaffRoleFindOneRequestDto extends IntersectionType(PickType(StaffRoleRequiredDto, ['id'])) implements StaffRoleFindOneRequest {}

export class StaffRoleUpdateOneRequestDto
	extends IntersectionType(PickType(RequestOtherFieldsDto, ['actionsToConnect', 'actionsToDisconnect']))
	implements StaffRoleUpdateOneRequest {}

export class StaffRoleDeleteOneRequestDto extends IntersectionType(PickType(StaffRoleRequiredDto, ['id'])) implements StaffRoleDeleteOneRequest {}

//==//

export class PartnerRoleFindManyRequestDto extends IntersectionType(PickType(PartnerRoleOptionalDto, ['name']), PaginationRequestDto) implements PartnerRoleFindManyRequest {}

export class PartnerRoleFindOneRequestDto extends IntersectionType(PickType(PartnerRoleRequiredDto, ['id'])) implements PartnerRoleFindOneRequest {}

export class PartnerRoleUpdateOneRequestDto
	extends IntersectionType(PickType(RequestOtherFieldsDto, ['actionsToConnect', 'actionsToDisconnect']))
	implements PartnerRoleUpdateOneRequest {}

export class PartnerRoleDeleteOneRequestDto extends IntersectionType(PickType(PartnerRoleRequiredDto, ['id'])) implements PartnerRoleDeleteOneRequest {}
