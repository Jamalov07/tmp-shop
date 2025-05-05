import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DefaultOptionalFieldsDto, DefaultRequiredFieldsDto, IsIntOrBigInt } from '../../../common'
import { StaffPaymentOptional, StaffPaymentRequired } from '../interfaces'
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class StaffPaymentRequiredDto extends DefaultRequiredFieldsDto implements StaffPaymentRequired {
	@ApiProperty({ type: BigInt })
	@IsNotEmpty()
	@IsIntOrBigInt()
	sum: bigint

	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsString()
	description: string

	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsUUID('4')
	staffId: string
}

export class StaffPaymentOptionalDto extends DefaultOptionalFieldsDto implements StaffPaymentOptional {
	@ApiPropertyOptional({ type: BigInt })
	@IsOptional()
	@IsIntOrBigInt()
	sum?: bigint

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsString()
	description?: string

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsUUID('4')
	staffId?: string
}
