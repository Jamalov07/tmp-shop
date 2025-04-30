import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { GoogleSheetService } from '../google-sheet'

@Injectable()
export class CronService {
	private readonly logger = new Logger(CronService.name)

	private readonly googleSheetService: GoogleSheetService
	constructor(googleSheetService: GoogleSheetService) {
		this.googleSheetService = googleSheetService
	}
}
