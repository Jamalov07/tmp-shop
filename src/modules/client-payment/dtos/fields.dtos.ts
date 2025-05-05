import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { DefaultOptionalFieldsDto, DefaultRequiredFieldsDto, IsIntOrBigInt } from '../../../common'
import { ClientPaymentOptional, ClientPaymentRequired } from '../interfaces'
import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID } from 'class-validator'

export class ClientPaymentRequiredDto extends DefaultRequiredFieldsDto implements ClientPaymentRequired {
	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsString()
	description: string

	@ApiProperty({ type: BigInt })
	@IsNotEmpty()
	@IsIntOrBigInt()
	card: bigint

	@ApiProperty({ type: BigInt })
	@IsNotEmpty()
	@IsIntOrBigInt()
	cash: bigint

	@ApiProperty({ type: BigInt })
	@IsNotEmpty()
	@IsIntOrBigInt()
	other: bigint

	@ApiProperty({ type: BigInt })
	@IsNotEmpty()
	@IsIntOrBigInt()
	transfer: bigint

	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsUUID('4')
	clientId: string
}

export class ClientPaymentOptionalDto extends DefaultOptionalFieldsDto implements ClientPaymentOptional {
	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsString()
	description?: string

	@ApiPropertyOptional({ type: BigInt })
	@IsOptional()
	@IsIntOrBigInt()
	card?: bigint

	@ApiPropertyOptional({ type: BigInt })
	@IsOptional()
	@IsIntOrBigInt()
	cash?: bigint

	@ApiPropertyOptional({ type: BigInt })
	@IsOptional()
	@IsIntOrBigInt()
	other?: bigint

	@ApiPropertyOptional({ type: BigInt })
	@IsOptional()
	@IsIntOrBigInt()
	transfer?: bigint

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsUUID('4')
	clientId?: string
}
