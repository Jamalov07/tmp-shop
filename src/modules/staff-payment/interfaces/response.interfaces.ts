import { GlobalResponse, PaginationResponse } from '@common'
import { StaffPaymentRequired } from './fields.interfaces'

export declare interface StaffPaymentFindManyData extends PaginationResponse<StaffPaymentFindOneData> {}

export declare interface StaffPaymentFindOneData extends Pick<StaffPaymentRequired, 'id' | 'createdAt' | 'sum' | 'description'> {}

export declare interface StaffPaymentFindManyResponse extends GlobalResponse {
	data: StaffPaymentFindManyData
}

export declare interface StaffPaymentFindOneResponse extends GlobalResponse {
	data: StaffPaymentFindOneData
}

export declare interface StaffPaymentCreateOneResponse extends GlobalResponse {
	data: StaffPaymentFindOneData
}

export declare interface StaffPaymentModifyResposne extends GlobalResponse {
	data: null
}
