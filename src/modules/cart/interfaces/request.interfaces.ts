import { PaginationRequest, RequestOtherFields } from '../../../common'
import { CartOptional, CartRequired } from './fields.interfaces'

export declare interface CartFindManyRequest
	extends PaginationRequest,
		Pick<CartOptional, 'publicId' | 'description' | 'direction' | 'modelId' | 'staffId' | 'tissue'>,
		Pick<RequestOtherFields, 'isDeleted'> {}

export declare interface CartFindOneRequest extends Pick<CartRequired, 'id'> {}

export declare interface CartGetManyRequest extends PaginationRequest, CartOptional, Pick<RequestOtherFields, 'ids' | 'isDeleted'> {}

export declare interface CartGetOneRequest extends CartOptional {}

export declare interface CartCreateOneRequest
	extends Pick<CartRequired, 'publicId' | 'description' | 'direction' | 'modelId' | 'price' | 'priceWithSale' | 'quantity' | 'sale' | 'tissue' | 'totalSum'>,
		Pick<CartOptional, 'staffId'> {}

export declare interface CartUpdateOneRequest
	extends Pick<
		CartOptional,
		'publicId' | 'description' | 'direction' | 'modelId' | 'price' | 'priceWithSale' | 'quantity' | 'sale' | 'staffId' | 'tissue' | 'totalSum' | 'deletedAt'
	> {}

export declare interface CartDeleteOneRequest extends Pick<CartOptional, 'id'>, Pick<RequestOtherFields, 'method'> {}
