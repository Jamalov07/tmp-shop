import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { PublicIdOptional, PublicIdRequired } from '../interfaces'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { DefaultOptionalFieldsDto, DefaultRequiredFieldsDto, IsPublicId } from '../../../common'

export class PublicIdRequiredDto extends PickType(DefaultRequiredFieldsDto, ['createdAt']) implements PublicIdRequired {
	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsString()
	@IsPublicId()
	id: string
}

export class PublicIdOptionalDto extends PickType(DefaultOptionalFieldsDto, ['createdAt']) implements PublicIdOptional {
	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsString()
	@IsPublicId()
	id?: string
}
