import { GlobalResponse, PaginationResponse } from '@common'
import { SupplierRequired } from './fields.interfaces'

export declare interface SupplierFindManyData extends PaginationResponse<SupplierFindOneData> {}

export declare interface SupplierFindOneData extends Pick<SupplierRequired, 'id' | 'phone' | 'fullname' | 'createdAt' | 'balance'> {}

export declare interface SupplierFindManyResponse extends GlobalResponse {
	data: SupplierFindManyData
}

export declare interface SupplierFindOneResponse extends GlobalResponse {
	data: SupplierFindOneData
}

export declare interface SupplierCreateOneResponse extends GlobalResponse {
	data: SupplierFindOneData
}

export declare interface SupplierModifyResposne extends GlobalResponse {
	data: null
}
