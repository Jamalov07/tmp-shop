import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DefaultOptionalFieldsDto, DefaultRequiredFieldsDto } from '@common'
import { ModelOptional, ModelRequired } from '../interfaces'

export class ModelRequiredDto extends DefaultRequiredFieldsDto implements ModelRequired {
	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsString()
	name: string

	@ApiProperty({ type: String, example: '00097072-f510-4ded-a18f-976d7fa2e024' })
	@IsNotEmpty()
	@IsString()
	@IsUUID('4')
	furnitureTypeId: string

	@ApiProperty({ type: String, example: '00097072-f510-4ded-a18f-976d7fa2e024' })
	@IsNotEmpty()
	@IsString()
	@IsUUID('4')
	providerId: string
}

export class ModelOptionalDto extends DefaultOptionalFieldsDto implements ModelOptional {
	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsString()
	name?: string

	@ApiPropertyOptional({ type: String, example: '00097072-f510-4ded-a18f-976d7fa2e024' })
	@IsOptional()
	@IsString()
	@IsUUID('4')
	furnitureTypeId?: string

	@ApiPropertyOptional({ type: String, example: '00097072-f510-4ded-a18f-976d7fa2e024' })
	@IsOptional()
	@IsString()
	@IsUUID('4')
	providerId?: string
}
