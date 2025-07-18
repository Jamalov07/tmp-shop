import { Module } from '@nestjs/common'
import { PrismaModule } from '../shared'
import { ProductMVController } from './product-mv.controller'
import { ProductMVService } from './product-mv.service'
import { ProductMVRepository } from './product-mv.repository'
import { BotModule } from '../bot'
import { ClientModule } from '../client'

@Module({
	imports: [PrismaModule, BotModule, ClientModule],
	controllers: [ProductMVController],
	providers: [ProductMVService, ProductMVRepository],
	exports: [ProductMVService, ProductMVRepository],
})
export class ProductMVModule {}
