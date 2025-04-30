import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from '@shared'
import { JsonWebTokenService } from './jwt.service'
import { StaffModule } from '../staff'
import { StaffAuthController, StaffAuthRepository, StaffAuthService } from './staff-auth'
import { PartnerAuthController, PartnerAuthRepository, PartnerAuthService } from './partner-auth'
import { PartnerModule } from '../partner'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthRepository } from './auth.repository'

@Module({
	imports: [PrismaModule, JwtModule.register({ global: true }), StaffModule, PartnerModule],
	controllers: [StaffAuthController, PartnerAuthController, AuthController],
	providers: [StaffAuthService, StaffAuthRepository, PartnerAuthService, PartnerAuthRepository, JsonWebTokenService, AuthService, AuthRepository],
	exports: [],
})
export class AuthModule {}
