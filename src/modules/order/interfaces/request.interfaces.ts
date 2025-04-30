import { PaginationRequest, RequestOtherFields } from '../../../common'
import { OrderProductCreateOneRequest } from '../../order-product'
import { PaymentCreateOneRequest } from '../../payment'
import { OrderOptional, OrderRequired } from './fields.interfaces'

export declare interface OrderFindManyRequest
	extends PaginationRequest,
		Pick<OrderOptional, 'clientId' | 'deliveryAddress' | 'staffId'>,
		Pick<RequestOtherFields, 'ids' | 'isDeleted' | 'search'> {}

export declare interface OrderFindOneRequest extends Pick<OrderRequired, 'id'> {}

export declare interface OrderGetManyRequest extends PaginationRequest, OrderOptional, Pick<RequestOtherFields, 'ids' | 'isDeleted'> {}

export declare interface OrderGetOneRequest extends OrderOptional {}

export declare interface OrderCreateOneRequest extends Pick<OrderRequired, 'clientId' | 'deliveryAddress' | 'deliveryDate' | 'staffId'>, Pick<OrderOptional, 'purchaseStatus'> {}

export declare interface OrderCreateOneWithPaymentProductRequest
	extends Pick<OrderRequired, 'clientId' | 'deliveryAddress' | 'deliveryDate'>,
		Pick<OrderOptional, 'staffId' | 'purchaseStatus'> {
	products: Omit<OrderProductCreateOneRequest, 'orderId'>[]
	payments: Omit<PaymentCreateOneRequest, 'orderId'>[]
}

export declare interface OrderUpdateOneRequest extends Pick<OrderOptional, 'clientId' | 'deletedAt' | 'status' | 'deliveryDate' | 'deliveryAddress' | 'staffId'> {}

export declare interface OrderDeleteOneRequest extends Pick<OrderOptional, 'id'>, Pick<RequestOtherFields, 'method'> {}
