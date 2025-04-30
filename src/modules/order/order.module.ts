import { Module } from '@nestjs/common'
import { GoogleSheetModule, PrismaModule } from '../shared'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'
import { OrderRepository } from './order.repository'
import { PartnerModule } from '../partner'
import { OrderProductModule } from '../order-product'
import { PaymentModule } from '../payment'
import { CartModule } from '../cart'

@Module({
	imports: [PrismaModule, GoogleSheetModule, PartnerModule, OrderProductModule, PaymentModule, CartModule],
	controllers: [OrderController],
	providers: [OrderService, OrderRepository],
	exports: [OrderService, OrderRepository],
})
export class OrderModule {}
