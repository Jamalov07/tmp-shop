import { GlobalResponse, PaginationResponse } from '../../../common'
import { FurnitureTypeFindOneData } from '../../furniture-type'
import { PartnerFindOneData } from '../../partner'
import { ModelRequired } from './fields.interfaces'

export declare interface ModelFindManyData extends PaginationResponse<ModelFindOneData> {}

export declare interface ModelFindManyResponse extends GlobalResponse {
	data: ModelFindManyData
}

export declare interface ModelFindOneData extends Pick<ModelRequired, 'id' | 'name' | 'createdAt'> {
	furnitureType?: FurnitureTypeFindOneData
	provider?: PartnerFindOneData
}

export declare interface ModelFindOneResponse extends GlobalResponse {
	data: ModelFindOneData
}

export declare interface ModelModifyResposne extends GlobalResponse {
	data: null
}
