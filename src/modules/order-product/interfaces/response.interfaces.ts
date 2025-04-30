import { GlobalResponse, PaginationResponse } from '../../../common'
import { ModelFindOneData } from '../../model'
import { OrderProductRequired } from './fields.interfaces'

export declare interface OrderProductFindManyData extends PaginationResponse<OrderProductFindOneData> {}

export declare interface OrderProductFindManyResponse extends GlobalResponse {
	data: OrderProductFindManyData
}

export declare interface OrderProductFindOneData
	extends Pick<
		OrderProductRequired,
		'id' | 'createdAt' | 'description' | 'direction' | 'price' | 'priceWithSale' | 'publicId' | 'quantity' | 'sale' | 'status' | 'tissue' | 'totalSum'
	> {
	model: ModelFindOneData
}

export declare interface OrderProductFindOneResponse extends GlobalResponse {
	data: OrderProductFindOneData
}

export declare interface OrderProductModifyResposne extends GlobalResponse {
	data: null
}
