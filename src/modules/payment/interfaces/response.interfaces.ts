import { GlobalResponse, PaginationResponse } from '../../../common'
import { PaymentRequired } from './fields.interfaces'

export declare interface PaymentFindManyData extends PaginationResponse<PaymentFindOneData> {}

export declare interface PaymentFindManyResponse extends GlobalResponse {
	data: PaymentFindManyData
}

export declare interface PaymentFindOneData
	extends Pick<PaymentRequired, 'id' | 'sum' | 'createdAt' | 'exchangeRate' | 'description' | 'fromCurrency' | 'method' | 'toCurrency' | 'totalSum'> {}

export declare interface PaymentFindOneResponse extends GlobalResponse {
	data: PaymentFindOneData
}

export declare interface PaymentModifyResposne extends GlobalResponse {
	data: null
}
