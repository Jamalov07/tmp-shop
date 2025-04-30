import { GlobalResponse, PaginationResponse } from '@common'
import { PartnerRequired } from './fields.interfaces'
import { PartnerRoleFindOneData } from '../../role'

export declare interface PartnerFindManyData extends PaginationResponse<PartnerFindOneData> {}

export declare interface PartnerFindOneData extends Pick<PartnerRequired, 'id' | 'fullname' | 'createdAt' | 'phone' | 'whereFrom'> {
	actionIds?: string[]
	roles?: PartnerRoleFindOneData[]
}

export declare interface PartnerFindManyResponse extends GlobalResponse {
	data: PartnerFindManyData
}

export declare interface PartnerFindOneResponse extends GlobalResponse {
	data: PartnerFindOneData
}

export declare interface PartnerModifyResposne extends GlobalResponse {
	data: null
}
