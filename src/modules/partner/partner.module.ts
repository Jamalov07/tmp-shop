import { Module } from '@nestjs/common'
import { PrismaModule } from '../shared'
import { PartnerController } from './partner.controller'
import { PartnerService } from './partner.service'
import { PartnerRepository } from './partner.repository'

@Module({
	imports: [PrismaModule],
	controllers: [PartnerController],
	providers: [PartnerService, PartnerRepository],
	exports: [PartnerService, PartnerRepository],
})
export class PartnerModule {}
