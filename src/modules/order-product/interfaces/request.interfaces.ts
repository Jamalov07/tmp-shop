import { PaginationRequest, RequestOtherFields } from '../../../common'
import { OrderProductOptional, OrderProductRequired } from './fields.interfaces'

export declare interface OrderProductFindManyRequest
	extends PaginationRequest,
		Pick<OrderProductOptional, 'publicId' | 'description' | 'direction' | 'modelId' | 'tissue' | 'orderId'>,
		Pick<RequestOtherFields, 'isDeleted'> {
	modelProviderId?: string
}

export declare interface OrderProductFindOneRequest extends Pick<OrderProductRequired, 'id'> {}

export declare interface OrderProductGetManyRequest extends PaginationRequest, OrderProductOptional, Pick<RequestOtherFields, 'ids' | 'isDeleted'> {}

export declare interface OrderProductGetOneRequest extends OrderProductOptional {}

export declare interface OrderProductCreateOneRequest
	extends Pick<OrderProductRequired, 'publicId' | 'description' | 'direction' | 'modelId' | 'price' | 'priceWithSale' | 'quantity' | 'sale' | 'tissue' | 'totalSum' | 'orderId'> {}

export declare interface OrderProductUpdateOneRequest
	extends Pick<
		OrderProductOptional,
		'publicId' | 'description' | 'direction' | 'modelId' | 'price' | 'priceWithSale' | 'quantity' | 'sale' | 'tissue' | 'totalSum' | 'deletedAt' | 'status' | 'orderId'
	> {}

export declare interface OrderProductDeleteOneRequest extends Pick<OrderProductOptional, 'id'>, Pick<RequestOtherFields, 'method'> {}
