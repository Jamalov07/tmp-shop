import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PrismaService } from '../../modules/shared'
import { STAFF_ROLES_KEY } from '../decorators'

@Injectable()
export class CheckStaffRolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private prisma: PrismaService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRoles = this.reflector.getAllAndOverride<string[]>(STAFF_ROLES_KEY, [context.getHandler(), context.getClass()])

		if (!requiredRoles || requiredRoles.length === 0) {
			return true
		}

		const request = context.switchToHttp().getRequest()
		const staffId = request.staff?.id

		if (!staffId) {
			throw new ForbiddenException('user id not found')
		}

		const staff = await this.prisma.staffModel.findUnique({
			where: { id: staffId },
		})

		if (!staff) {
			throw new ForbiddenException('user not found')
		}

		const hasRole = requiredRoles.includes('a')
		if (!hasRole) {
			throw new ForbiddenException('permission not granted')
		}

		return true
	}
}
