import { PaginationRequest, RequestOtherFields } from '../../../common'
import { StaffPaymentOptional, StaffPaymentRequired } from './fields.interfaces'

export declare interface StaffPaymentFindManyRequest
	extends Pick<StaffPaymentOptional, 'staffId' | 'description'>,
		PaginationRequest,
		Pick<RequestOtherFields, 'startDate' | 'endDate' | 'isDeleted'> {}

export declare interface StaffPaymentFindOneRequest extends Pick<StaffPaymentRequired, 'id'> {}

export declare interface StaffPaymentGetManyRequest extends PaginationRequest, StaffPaymentOptional, Pick<RequestOtherFields, 'ids'> {}

export declare interface StaffPaymentGetOneRequest extends StaffPaymentOptional {}

export declare interface StaffPaymentCreateOneRequest extends Pick<StaffPaymentRequired, 'sum' | 'staffId' | 'description'> {}

export declare interface StaffPaymentUpdateOneRequest extends Pick<StaffPaymentOptional, 'staffId' | 'sum' | 'description' | 'deletedAt'> {}

export declare interface StaffPaymentDeleteOneRequest extends Pick<StaffPaymentRequired, 'id'>, Pick<RequestOtherFields, 'method'> {}
