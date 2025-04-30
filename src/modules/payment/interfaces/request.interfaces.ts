import { PaginationRequest, RequestOtherFields } from '../../../common'
import { PaymentOptional, PaymentRequired } from './fields.interfaces'

export declare interface PaymentFindManyRequest
	extends PaginationRequest,
		Pick<PaymentOptional, 'method' | 'description' | 'fromCurrency' | 'orderId'>,
		Pick<RequestOtherFields, 'ids' | 'isDeleted'> {}

export declare interface PaymentFindOneRequest extends Pick<PaymentRequired, 'id'> {}

export declare interface PaymentGetManyRequest extends PaginationRequest, PaymentOptional, Pick<RequestOtherFields, 'ids' | 'isDeleted'> {}

export declare interface PaymentGetOneRequest extends PaymentOptional {}

export declare interface PaymentCreateOneRequest extends Pick<PaymentRequired, 'sum' | 'description' | 'exchangeRate' | 'fromCurrency' | 'method' | 'orderId' | 'totalSum'> {}

export declare interface PaymentUpdateOneRequest
	extends Pick<PaymentOptional, 'sum' | 'description' | 'fromCurrency' | 'exchangeRate' | 'method' | 'orderId' | 'totalSum' | 'deletedAt'> {}

export declare interface PaymentDeleteOneRequest extends Pick<PaymentOptional, 'id'>, Pick<RequestOtherFields, 'method'> {}
