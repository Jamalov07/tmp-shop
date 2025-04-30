import { IntersectionType, PickType } from '@nestjs/swagger'
import { PartnerSignInRequest } from '../interfaces'
import { PartnerRequiredDto } from '../../../partner'

export class PartnerSignInRequestDto extends IntersectionType(PickType(PartnerRequiredDto, ['password', 'phone'])) implements PartnerSignInRequest {}
