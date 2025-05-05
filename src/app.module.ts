import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ActionModule, AuthModule, ClientModule, ClientPaymentModule, CronModule, ExcelModule, PrismaModule, RoleModule, StaffModule, StaffPaymentModule } from '@module'
import { appConfig, databaseConfig, jwtConfig } from '@config'
import { AuthGuard, CheckPermissionGuard } from '@common'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [appConfig, databaseConfig, jwtConfig],
		}),
		PrismaModule,
		ActionModule,
		AuthModule,
		StaffModule,
		RoleModule,
		ClientModule,
		StaffPaymentModule,
		ClientPaymentModule,
		CronModule,
		ExcelModule,
	],
	controllers: [],
	providers: [AuthGuard, CheckPermissionGuard],
})
export class AppModule {}
