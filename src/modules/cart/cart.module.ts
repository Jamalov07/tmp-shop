import { Module } from '@nestjs/common'
import { PrismaModule } from '../shared'
import { CartController } from './cart.controller'
import { CartService } from './cart.service'
import { CartRepository } from './cart.repository'
import { StaffModule } from '../staff'

@Module({
	imports: [PrismaModule, StaffModule],
	controllers: [CartController],
	providers: [CartService, CartRepository],
	exports: [CartService, CartRepository],
})
export class CartModule {}
