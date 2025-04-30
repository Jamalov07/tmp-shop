import { OrderModel } from '@prisma/client'

export declare interface OrderRequired extends Required<OrderModel> {}

export declare interface OrderOptional extends Partial<OrderModel> {}
