import { PickType } from '@nestjs/swagger'
import { PublicIdGenerateRequest, PublicIdSearchRequest } from '../interfaces'
import { PublicIdRequiredDto } from './fields.dtos'

export class PublicIdSearchRequestDto extends PickType(PublicIdRequiredDto, ['id']) implements PublicIdSearchRequest {}

export class PublicIdGenerateRequestDto implements PublicIdGenerateRequest {}
