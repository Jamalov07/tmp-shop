import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DefaultOptionalFieldsDto, DefaultRequiredFieldsDto } from '@common'
import { FurnitureTypeOptional, FurnitureTypeRequired } from '../interfaces'

export class FurnitureTypeRequiredDto extends DefaultRequiredFieldsDto implements FurnitureTypeRequired {
	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsString()
	name: string
}

export class FurnitureTypeOptionalDto extends DefaultOptionalFieldsDto implements FurnitureTypeOptional {
	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsString()
	name?: string
}
