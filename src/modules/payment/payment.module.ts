import { Module } from '@nestjs/common'
import { PrismaModule } from '../shared'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'
import { PaymentRepository } from './payment.repository'
import { PartnerModule } from '../partner'

@Module({
	imports: [PrismaModule, PartnerModule],
	controllers: [PaymentController],
	providers: [PaymentService, PaymentRepository],
	exports: [PaymentService, PaymentRepository],
})
export class PaymentModule {}
