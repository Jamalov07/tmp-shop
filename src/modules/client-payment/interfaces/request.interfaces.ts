import { PaginationRequest, RequestOtherFields } from '@common'
import { ClientPaymentOptional, ClientPaymentRequired } from './fields.interfaces'

export declare interface ClientPaymentFindManyRequest extends Pick<ClientPaymentOptional, 'clientId' | 'description'>, PaginationRequest {}

export declare interface ClientPaymentFindOneRequest extends Pick<ClientPaymentRequired, 'id'> {}

export declare interface ClientPaymentGetManyRequest extends ClientPaymentOptional, PaginationRequest, Pick<RequestOtherFields, 'ids'> {}

export declare interface ClientPaymentGetOneRequest extends ClientPaymentOptional {}

export declare interface ClientPaymentCreateOneRequest extends Pick<ClientPaymentRequired, 'card' | 'cash' | 'clientId' | 'description' | 'other' | 'transfer'> {}

export declare interface ClientPaymentUpdateOneRequest extends Pick<ClientPaymentOptional, 'deletedAt' | 'card' | 'cash' | 'clientId' | 'description' | 'other' | 'transfer'> {}

export declare interface ClientPaymentDeleteOneRequest extends Pick<ClientPaymentOptional, 'id'> {}
