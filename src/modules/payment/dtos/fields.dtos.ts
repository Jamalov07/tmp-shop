import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DefaultOptionalFieldsDto, DefaultRequiredFieldsDto, IsIntOrBigInt } from '@common'
import { PaymentOptional, PaymentRequired } from '../interfaces'
import { $Enums, PaymentCurrencyEnum, PaymentMethodEnum } from '@prisma/client'

export class PaymentRequiredDto extends DefaultRequiredFieldsDto implements PaymentRequired {
	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsString()
	description: string

	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsUUID('4')
	orderId: string

	@ApiProperty({ type: BigInt })
	@IsNotEmpty()
	@IsIntOrBigInt()
	sum: bigint

	@ApiProperty({ type: BigInt })
	@IsNotEmpty()
	@IsIntOrBigInt()
	totalSum: bigint

	@ApiProperty({ type: BigInt })
	@IsNotEmpty()
	@IsIntOrBigInt()
	exchangeRate: bigint

	@ApiProperty({ enum: PaymentCurrencyEnum })
	@IsNotEmpty()
	@IsEnum(PaymentCurrencyEnum)
	fromCurrency: $Enums.PaymentCurrencyEnum

	@ApiProperty({ enum: PaymentCurrencyEnum })
	@IsNotEmpty()
	@IsEnum(PaymentCurrencyEnum)
	toCurrency: $Enums.PaymentCurrencyEnum

	@ApiProperty({ enum: PaymentMethodEnum })
	@IsNotEmpty()
	@IsEnum(PaymentMethodEnum)
	method: $Enums.PaymentMethodEnum
}

export class PaymentOptionalDto extends DefaultOptionalFieldsDto implements PaymentOptional {
	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsString()
	description?: string

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsUUID('4')
	orderId?: string

	@ApiPropertyOptional({ type: BigInt })
	@IsOptional()
	@IsIntOrBigInt()
	sum?: bigint

	@ApiPropertyOptional({ type: BigInt })
	@IsOptional()
	@IsIntOrBigInt()
	totalSum?: bigint

	@ApiPropertyOptional({ type: BigInt })
	@IsOptional()
	@IsIntOrBigInt()
	exchangeRate?: bigint

	@ApiPropertyOptional({ enum: PaymentCurrencyEnum })
	@IsOptional()
	@IsEnum(PaymentCurrencyEnum)
	fromCurrency?: $Enums.PaymentCurrencyEnum

	@ApiPropertyOptional({ enum: PaymentCurrencyEnum })
	@IsOptional()
	@IsEnum(PaymentCurrencyEnum)
	toCurrency?: $Enums.PaymentCurrencyEnum

	@ApiPropertyOptional({ enum: PaymentMethodEnum })
	@IsOptional()
	@IsEnum(PaymentMethodEnum)
	method?: $Enums.PaymentMethodEnum
}
