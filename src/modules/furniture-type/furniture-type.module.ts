import { Module } from '@nestjs/common'
import { PrismaModule } from '../shared'
import { FurnitureTypeController } from './furniture-type.controller'
import { FurnitureTypeService } from './furniture-type.service'
import { FurnitureTypeRepository } from './furniture-type.repository'

@Module({
	imports: [PrismaModule],
	controllers: [FurnitureTypeController],
	providers: [FurnitureTypeService, FurnitureTypeRepository],
	exports: [FurnitureTypeService, FurnitureTypeRepository],
})
export class FurnitureTypeModule {}
