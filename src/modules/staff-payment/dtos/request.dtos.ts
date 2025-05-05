import { PickType, IntersectionType } from '@nestjs/swagger'
import { StaffPaymentCreateOneRequest, StaffPaymentDeleteOneRequest, StaffPaymentFindManyRequest, StaffPaymentFindOneRequest, StaffPaymentUpdateOneRequest } from '../interfaces'
import { PaginationRequestDto, RequestOtherFieldsDto } from '@common'
import { StaffPaymentOptionalDto, StaffPaymentRequiredDto } from './fields.dtos'

export class StaffPaymentFindManyRequestDto
	extends IntersectionType(
		PickType(StaffPaymentOptionalDto, ['description', 'staffId']),
		PaginationRequestDto,
		PickType(RequestOtherFieldsDto, ['endDate', 'startDate', 'isDeleted']),
	)
	implements StaffPaymentFindManyRequest {}

export class StaffPaymentFindOneRequestDto extends IntersectionType(PickType(StaffPaymentRequiredDto, ['id'])) implements StaffPaymentFindOneRequest {}

export class StaffPaymentCreateOneRequestDto
	extends IntersectionType(PickType(StaffPaymentRequiredDto, ['sum', 'description', 'staffId']))
	implements StaffPaymentCreateOneRequest {}

export class StaffPaymentUpdateOneRequestDto
	extends IntersectionType(PickType(StaffPaymentOptionalDto, ['deletedAt', 'description', 'staffId', 'sum']))
	implements StaffPaymentUpdateOneRequest {}

export class StaffPaymentDeleteOneRequestDto extends IntersectionType(PickType(StaffPaymentRequiredDto, ['id'])) implements StaffPaymentDeleteOneRequest {}
