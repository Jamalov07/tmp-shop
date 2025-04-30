import { Module } from '@nestjs/common'
import { PrismaModule } from '../shared'
import { StaffRoleController, StaffRoleRepository, StaffRoleService } from './staff-role'
import { PartnerRoleController, PartnerRoleRepository, PartnerRoleService } from './partner-role'

@Module({
	imports: [PrismaModule],
	controllers: [StaffRoleController, PartnerRoleController],
	providers: [StaffRoleService, StaffRoleRepository, PartnerRoleService, PartnerRoleRepository],
	exports: [StaffRoleService, StaffRoleRepository, PartnerRoleService, PartnerRoleRepository],
})
export class RoleModule {}
