import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { DefaultOptionalFieldsDto, DefaultRequiredFieldsDto } from '../../../common'
import { PartnerRoleOptional, PartnerRoleRequired, StaffRoleOptional, StaffRoleRequired } from '../interfaces'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { PartnerRoleEnum, StaffRoleEnum } from '@prisma/client'

export class StaffRoleRequiredDto extends PickType(DefaultRequiredFieldsDto, ['id', 'createdAt']) implements StaffRoleRequired {
	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsString()
	name: StaffRoleEnum
}

export class StaffRoleOptionalDto extends PickType(DefaultOptionalFieldsDto, ['id', 'createdAt']) implements StaffRoleOptional {
	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsString()
	name?: StaffRoleEnum
}

export class PartnerRoleRequiredDto extends PickType(DefaultRequiredFieldsDto, ['id', 'createdAt']) implements PartnerRoleRequired {
	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsString()
	name: PartnerRoleEnum
}

export class PartnerRoleOptionalDto extends PickType(DefaultOptionalFieldsDto, ['id', 'createdAt']) implements PartnerRoleOptional {
	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsString()
	name?: PartnerRoleEnum
}
