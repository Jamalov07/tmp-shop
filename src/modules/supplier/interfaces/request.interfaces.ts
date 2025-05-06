import { PaginationRequest, RequestOtherFields } from '../../../common'
import { SupplierOptional, SupplierRequired } from './fields.interfaces'

export declare interface SupplierFindManyRequest extends Pick<SupplierOptional, 'phone' | 'fullname'>, PaginationRequest, Pick<RequestOtherFields, 'search' | 'isDeleted'> {}

export declare interface SupplierFindOneRequest extends Pick<SupplierRequired, 'id'> {}

export declare interface SupplierGetManyRequest extends SupplierOptional, PaginationRequest, Pick<RequestOtherFields, 'ids' | 'isDeleted'> {}

export declare interface SupplierGetOneRequest extends SupplierOptional, Pick<RequestOtherFields, 'isDeleted'> {}

export declare interface SupplierCreateOneRequest extends Pick<SupplierRequired, 'phone' | 'fullname'> {}

export declare interface SupplierUpdateOneRequest extends Pick<SupplierOptional, 'phone' | 'fullname' | 'deletedAt' | 'balance'> {}

export declare interface SupplierDeleteOneRequest extends Pick<SupplierRequired, 'id'>, Pick<RequestOtherFields, 'method'> {}
