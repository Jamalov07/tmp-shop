import { Module } from '@nestjs/common'
import { PublicIdController } from './public-id.controller'
import { PublicIdService } from './public-id.service'
import { PrismaModule } from '../shared/prisma'

@Module({
	imports: [PrismaModule],
	controllers: [PublicIdController],
	providers: [PublicIdService],
	exports: [PublicIdService],
})
export class PublicIdModule {}
