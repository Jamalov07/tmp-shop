import { GlobalResponse, PaginationResponse } from '@common'
import { StaffRequired } from './fields.interfaces'
import { StaffRoleFindOneData } from '../../role'

export declare interface StaffFindManyData extends PaginationResponse<StaffFindOneData> {}

export declare interface StaffFindOneData extends Pick<StaffRequired, 'id' | 'fullname' | 'createdAt' | 'phone'> {
	actionIds?: string[]
	roles?: StaffRoleFindOneData[]
}

export declare interface StaffFindManyResponse extends GlobalResponse {
	data: StaffFindManyData
}

export declare interface StaffFindOneResponse extends GlobalResponse {
	data: StaffFindOneData
}

export declare interface StaffModifyResposne extends GlobalResponse {
	data: null
}
