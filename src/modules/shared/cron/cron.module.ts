import { Module } from '@nestjs/common'
import { CronService } from './cron.service'
import { ScheduleModule } from '@nestjs/schedule'
import { GoogleSheetModule } from '../google-sheet'

@Module({
	imports: [ScheduleModule.forRoot(), GoogleSheetModule],
	providers: [CronService],
	exports: [CronService],
})
export class CronModule {}
