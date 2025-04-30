import { PaginationRequest, RequestOtherFields } from '@common'
import { PartnerRoleOptional, PartnerRoleRequired, StaffRoleOptional, StaffRoleRequired } from './fields.interfaces'

export declare interface StaffRoleFindManyRequest extends Pick<StaffRoleOptional, 'name'>, PaginationRequest, Pick<RequestOtherFields, 'ids'> {}

export declare interface StaffRoleFindOneRequest extends Pick<StaffRoleOptional, 'id' | 'name'> {}

export declare interface StaffRoleGetManyRequest extends Pick<StaffRoleOptional, 'name'>, PaginationRequest, Pick<RequestOtherFields, 'ids'> {}

export declare interface StaffRoleGetOneRequest extends Pick<StaffRoleOptional, 'id' | 'name'> {}

export declare interface StaffRoleCreateOneRequest extends Pick<StaffRoleRequired, 'name'>, Pick<RequestOtherFields, 'actionsToConnect'> {}

export declare interface StaffRoleUpdateOneRequest extends Pick<RequestOtherFields, 'actionsToConnect' | 'actionsToDisconnect'> {}

export declare interface StaffRoleDeleteOneRequest extends Pick<StaffRoleOptional, 'id'> {}

//====//

export declare interface PartnerRoleFindManyRequest extends Pick<PartnerRoleOptional, 'name'>, PaginationRequest, Pick<RequestOtherFields, 'ids'> {}

export declare interface PartnerRoleFindOneRequest extends Pick<PartnerRoleOptional, 'id' | 'name'> {}

export declare interface PartnerRoleGetManyRequest extends Pick<PartnerRoleOptional, 'name'>, PaginationRequest, Pick<RequestOtherFields, 'ids'> {}

export declare interface PartnerRoleGetOneRequest extends Pick<PartnerRoleOptional, 'id' | 'name'> {}

export declare interface PartnerRoleCreateOneRequest extends Pick<PartnerRoleRequired, 'name'>, Pick<RequestOtherFields, 'actionsToConnect'> {}

export declare interface PartnerRoleUpdateOneRequest extends Pick<RequestOtherFields, 'actionsToConnect' | 'actionsToDisconnect'> {}

export declare interface PartnerRoleDeleteOneRequest extends Pick<PartnerRoleOptional, 'id'> {}
