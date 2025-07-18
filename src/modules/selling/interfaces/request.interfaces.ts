import { PaginationRequest, RequestOtherFields } from '@common'
import { SellingOptional, SellingRequired } from './fields.interfaces'
import { ClientPaymentOptional, ClientPaymentRequired } from '../../client-payment'
import { ProductMVRequired } from '../../product-mv'
import { StatsTypeEnum } from '../enums'

export declare interface SellingFindManyRequest
	extends Pick<SellingOptional, 'clientId' | 'staffId' | 'status'>,
		PaginationRequest,
		Pick<RequestOtherFields, 'isDeleted' | 'search' | 'startDate' | 'endDate'> {}

export declare interface SellingFindOneRequest extends Pick<SellingOptional, 'id'> {}

export declare interface SellingGetManyRequest extends SellingOptional, PaginationRequest, Pick<RequestOtherFields, 'ids' | 'isDeleted' | 'startDate' | 'endDate'> {}

export declare interface SellingGetOneRequest extends SellingOptional, Pick<RequestOtherFields, 'isDeleted'> {}

export declare interface SellingPayment extends Pick<ClientPaymentRequired, 'card' | 'cash' | 'other' | 'transfer'>, Pick<ClientPaymentOptional, 'description'> {}

export declare interface SellingProduct extends Pick<ProductMVRequired, 'price' | 'count' | 'productId'> {}

export declare interface SellingCreateOneRequest extends Pick<SellingRequired, 'clientId' | 'date' | 'send'>, Pick<SellingOptional, 'staffId' | 'sended' | 'status'> {
	payment?: SellingPayment
	products?: SellingProduct[]
}

export declare interface SellingUpdateOneRequest extends Pick<SellingOptional, 'deletedAt' | 'clientId' | 'date' | 'status' | 'staffId' | 'sended' | 'send'> {
	payment?: SellingPayment
	products?: SellingProduct[]
	productIdsToRemove?: string[]
}

export declare interface SellingDeleteOneRequest extends Pick<SellingOptional, 'id'>, Pick<RequestOtherFields, 'method'> {}

export declare interface SellingGetTotalStatsRequest {}

export declare interface SellingGetPeriodStatsRequest {
	type?: StatsTypeEnum
}
