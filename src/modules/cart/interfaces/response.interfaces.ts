import { GlobalResponse, PaginationResponse } from '../../../common'
import { CartRequired } from './fields.interfaces'

export declare interface CartFindManyData extends PaginationResponse<CartFindOneData> {}

export declare interface CartFindManyResponse extends GlobalResponse {
	data: CartFindManyData
}

export declare interface CartFindOneData extends Pick<CartRequired, 'id' | 'createdAt'> {}

export declare interface CartFindOneResponse extends GlobalResponse {
	data: CartFindOneData
}

export declare interface CartModifyResposne extends GlobalResponse {
	data: null
}
