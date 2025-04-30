import { PaginationRequest, RequestOtherFields } from '@common'
import { PartnerOptional, PartnerRequired } from './fields.interfaces'
import { PartnerRoleEnum } from '@prisma/client'

export declare interface PartnerFindManyRequest
	extends Pick<PartnerOptional, 'fullname' | 'phone' | 'whereFrom'>,
		PaginationRequest,
		Pick<RequestOtherFields, 'ids' | 'isDeleted'> {
	roleNames?: PartnerRoleEnum[]
}

export declare interface PartnerFindOneRequest extends Pick<PartnerOptional, 'id'> {}

export declare interface PartnerGetManyRequest extends PartnerOptional, PaginationRequest, Pick<RequestOtherFields, 'ids' | 'isDeleted'> {}

export declare interface PartnerGetOneRequest extends PartnerOptional, Pick<RequestOtherFields, 'isDeleted'> {}

export declare interface PartnerCreateOneRequest
	extends Pick<PartnerRequired, 'fullname' | 'phone' | 'whereFrom' | 'password'>,
		Pick<RequestOtherFields, 'rolesToConnect' | 'actionsToConnect'> {}

export declare interface PartnerUpdateOneRequest
	extends Pick<PartnerOptional, 'balance' | 'fullname' | 'id' | 'password' | 'phone' | 'token' | 'whereFrom' | 'deletedAt'>,
		Pick<RequestOtherFields, 'rolesToConnect' | 'actionsToConnect' | 'rolesToDisconnect' | 'actionsToDisconnect'> {}

export declare interface PartnerDeleteOneRequest extends Pick<PartnerOptional, 'id'>, Pick<RequestOtherFields, 'method'> {}
