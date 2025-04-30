import { IntersectionType, PickType } from '@nestjs/swagger'
import { PartnerRequiredDto } from '../../partner'
import { PartnerSignInRequest } from '../partner-auth'

export class UserSignInRequestDto extends IntersectionType(PickType(PartnerRequiredDto, ['password', 'phone'])) implements PartnerSignInRequest {}
