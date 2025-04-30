import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma'
import { GoogleSheetService } from './google-sheet.service'

@Module({
	imports: [PrismaModule],
	providers: [GoogleSheetService],
	exports: [GoogleSheetService],
})
export class GoogleSheetModule {}
