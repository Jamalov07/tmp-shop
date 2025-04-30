import { PaginationRequest, RequestOtherFields } from '../../../common'
import { FurnitureTypeOptional, FurnitureTypeRequired } from './fields.interfaces'

export declare interface FurnitureTypeFindManyRequest extends PaginationRequest, Pick<FurnitureTypeOptional, 'name'>, Pick<RequestOtherFields, 'ids' | 'isDeleted'> {}

export declare interface FurnitureTypeFindOneRequest extends Pick<FurnitureTypeRequired, 'id'> {}

export declare interface FurnitureTypeGetManyRequest extends PaginationRequest, FurnitureTypeOptional, Pick<RequestOtherFields, 'ids' | 'isDeleted'> {}

export declare interface FurnitureTypeGetOneRequest extends FurnitureTypeOptional {}

export declare interface FurnitureTypeCreateOneRequest extends Pick<FurnitureTypeRequired, 'name'> {}

export declare interface FurnitureTypeUpdateOneRequest extends Pick<FurnitureTypeOptional, 'name' | 'deletedAt'> {}

export declare interface FurnitureTypeDeleteOneRequest extends Pick<FurnitureTypeOptional, 'id'>, Pick<RequestOtherFields, 'method'> {}
