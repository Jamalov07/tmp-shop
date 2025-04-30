import { GlobalResponse, PaginationResponse } from '@common'
import { PartnerRoleRequired, StaffRoleRequired } from './fields.interfaces'
import { ActionFindOneData } from '../../action/interfaces'

export declare interface StaffRoleFindManyData extends PaginationResponse<StaffRoleFindOneData> {}

export declare interface StaffRoleFindOneData extends Pick<StaffRoleRequired, 'id'> {
	actions?: ActionFindOneData[]
}

export declare interface StaffRoleFindManyResponse extends GlobalResponse {
	data: StaffRoleFindManyData
}

export declare interface StaffRoleFindOneResponse extends GlobalResponse {
	data: StaffRoleFindOneData
}

export declare interface StaffRoleModifyResposne extends GlobalResponse {
	data: null
}

//==//

export declare interface PartnerRoleFindManyData extends PaginationResponse<PartnerRoleFindOneData> {}

export declare interface PartnerRoleFindOneData extends Pick<PartnerRoleRequired, 'id' | 'name' | 'createdAt'> {
	actions?: ActionFindOneData[]
}

export declare interface PartnerRoleFindManyResponse extends GlobalResponse {
	data: PartnerRoleFindManyData
}

export declare interface PartnerRoleFindOneResponse extends GlobalResponse {
	data: PartnerRoleFindOneData
}

export declare interface PartnerRoleModifyResposne extends GlobalResponse {
	data: null
}
