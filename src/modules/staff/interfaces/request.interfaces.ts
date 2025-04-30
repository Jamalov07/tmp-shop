import { PaginationRequest, RequestOtherFields } from '@common'
import { StaffOptional, StaffRequired } from './fields.interfaces'
import { StaffRoleEnum } from '@prisma/client'

export declare interface StaffFindManyRequest extends Pick<StaffOptional, 'fullname' | 'phone'>, PaginationRequest, Pick<RequestOtherFields, 'isDeleted' | 'search'> {
	roleNames?: StaffRoleEnum[]
}

export declare interface StaffFindOneRequest extends Pick<StaffOptional, 'id'> {}

export declare interface StaffGetManyRequest extends StaffOptional, PaginationRequest, Pick<RequestOtherFields, 'ids' | 'isDeleted'> {}

export declare interface StaffGetOneRequest extends StaffOptional, Pick<RequestOtherFields, 'isDeleted'> {}

export declare interface StaffCreateOneRequest extends Pick<StaffRequired, 'fullname' | 'phone' | 'password'>, Pick<RequestOtherFields, 'actionsToConnect' | 'rolesToConnect'> {}

export declare interface StaffUpdateOneRequest
	extends Pick<StaffOptional, 'fullname' | 'id' | 'password' | 'phone' | 'token' | 'deletedAt'>,
		Pick<RequestOtherFields, 'actionsToConnect' | 'actionsToDisconnect' | 'rolesToConnect' | 'rolesToDisconnect'> {}

export declare interface StaffDeleteOneRequest extends Pick<StaffOptional, 'id'>, Pick<RequestOtherFields, 'method'> {}
