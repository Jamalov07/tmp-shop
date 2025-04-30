import { SetMetadata } from '@nestjs/common'

export const STAFF_ROLES_KEY = 'STAFF_ROLES'
export const Roles = (...roles: string[]) => SetMetadata(STAFF_ROLES_KEY, roles)
