import { GlobalResponse, PaginationResponse } from '@common'
import { ClientPaymentRequired } from './fields.interfaces'

export declare interface ClientPaymentFindManyData extends PaginationResponse<ClientPaymentFindOneData> {}

export declare interface ClientPaymentFindOneData extends Pick<ClientPaymentRequired, 'id' | 'cash' | 'createdAt'> {}

export declare interface ClientPaymentFindManyResponse extends GlobalResponse {
	data: ClientPaymentFindManyData
}

export declare interface ClientPaymentFindOneResponse extends GlobalResponse {
	data: ClientPaymentFindOneData
}

export declare interface ClientPaymentCreateOneResponse extends GlobalResponse {
	data: ClientPaymentFindOneData
}

export declare interface ClientPaymentModifyResposne extends GlobalResponse {
	data: null
}
