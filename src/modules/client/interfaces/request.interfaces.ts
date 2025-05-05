import { PaginationRequest, RequestOtherFields } from '../../../common'
import { ClientOptional, ClientRequired } from './fields.interfaces'

export declare interface ClientFindManyRequest extends Pick<ClientOptional, 'phone' | 'fullname'>, PaginationRequest, Pick<RequestOtherFields, 'search' | 'isDeleted'> {}

export declare interface ClientFindOneRequest extends Pick<ClientRequired, 'id'> {}

export declare interface ClientGetManyRequest extends ClientOptional, PaginationRequest, Pick<RequestOtherFields, 'ids' | 'isDeleted'> {}

export declare interface ClientGetOneRequest extends ClientOptional, Pick<RequestOtherFields, 'isDeleted'> {}

export declare interface ClientCreateOneRequest extends Pick<ClientRequired, 'phone' | 'fullname'> {}

export declare interface ClientUpdateOneRequest extends Pick<ClientOptional, 'phone' | 'fullname' | 'deletedAt' | 'balance'> {}

export declare interface ClientDeleteOneRequest extends Pick<ClientRequired, 'id'>, Pick<RequestOtherFields, 'method'> {}
