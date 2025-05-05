import { PaginationRequest, RequestOtherFields } from '@common'
import { RoleOptional, RoleRequired } from './fields.interfaces'

export declare interface RoleFindManyRequest extends Pick<RoleOptional, 'name'>, PaginationRequest {}

export declare interface RoleFindOneRequest extends Pick<RoleRequired, 'id'> {}

export declare interface RoleGetManyRequest extends RoleOptional, PaginationRequest, Pick<RequestOtherFields, 'ids'> {}

export declare interface RoleGetOneRequest extends RoleOptional {}

export declare interface RoleCreateOneRequest extends Pick<RoleRequired, 'name'>, Pick<RequestOtherFields, 'actionsToConnect'> {}

export declare interface RoleUpdateOneRequest extends Pick<RoleOptional, 'name'>, Pick<RequestOtherFields, 'actionsToConnect' | 'actionsToDisconnect'> {}

export declare interface RoleDeleteOneRequest extends Pick<RoleOptional, 'id'> {}
