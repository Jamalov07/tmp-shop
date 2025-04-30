import { PaginationRequest, RequestOtherFields } from '../../../common'
import { ModelOptional, ModelRequired } from './fields.interfaces'

export declare interface ModelFindManyRequest
	extends PaginationRequest,
		Pick<ModelOptional, 'name' | 'furnitureTypeId' | 'providerId'>,
		Pick<RequestOtherFields, 'ids' | 'isDeleted'> {}

export declare interface ModelFindOneRequest extends Pick<ModelRequired, 'id'> {}

export declare interface ModelGetManyRequest extends PaginationRequest, ModelOptional, Pick<RequestOtherFields, 'ids' | 'isDeleted'> {}

export declare interface ModelGetOneRequest extends ModelOptional {}

export declare interface ModelCreateOneRequest extends Pick<ModelRequired, 'name' | 'furnitureTypeId' | 'providerId'> {}

export declare interface ModelUpdateOneRequest extends Pick<ModelOptional, 'name' | 'deletedAt' | 'providerId' | 'furnitureTypeId'> {}

export declare interface ModelDeleteOneRequest extends Pick<ModelOptional, 'id'>, Pick<RequestOtherFields, 'method'> {}
