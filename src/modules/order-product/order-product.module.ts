import { Module } from '@nestjs/common'
import { PrismaModule } from '../shared'
import { OrderProductController } from './order-product.controller'
import { OrderProductService } from './order-product.service'
import { OrderProductRepository } from './order-product.repository'

@Module({
	imports: [PrismaModule],
	controllers: [OrderProductController],
	providers: [OrderProductService, OrderProductRepository],
	exports: [OrderProductService, OrderProductRepository],
})
export class OrderProductModule {}
