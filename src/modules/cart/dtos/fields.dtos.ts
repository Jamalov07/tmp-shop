import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DefaultOptionalFieldsDto, DefaultRequiredFieldsDto, IsIntOrBigInt, IsPublicId } from '@common'
import { CartOptional, CartRequired } from '../interfaces'
import { $Enums, ProductDirectionEnum } from '@prisma/client'

export class CartRequiredDto extends DefaultRequiredFieldsDto implements CartRequired {
	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsString()
	description: string

	@ApiProperty({ enum: ProductDirectionEnum })
	@IsNotEmpty()
	@IsEnum(ProductDirectionEnum)
	direction: $Enums.ProductDirectionEnum

	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsUUID('4')
	modelId: string

	@ApiProperty({ type: BigInt })
	@IsNotEmpty()
	@IsIntOrBigInt()
	price: bigint

	@ApiProperty({ type: BigInt })
	@IsNotEmpty()
	@IsIntOrBigInt()
	priceWithSale: bigint

	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsString()
	@IsPublicId()
	publicId: string

	@ApiProperty({ type: Number })
	@IsNotEmpty()
	@IsNumber()
	quantity: number

	@ApiProperty({ type: Number })
	@IsNotEmpty()
	@IsNumber()
	sale: number

	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsUUID('4')
	staffId: string

	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsString()
	tissue: string

	@ApiProperty({ type: BigInt })
	@IsNotEmpty()
	@IsIntOrBigInt()
	totalSum: bigint
}

export class CartOptionalDto extends DefaultOptionalFieldsDto implements CartOptional {
	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsString()
	description?: string

	@ApiPropertyOptional({ enum: ProductDirectionEnum })
	@IsOptional()
	@IsEnum(ProductDirectionEnum)
	direction?: $Enums.ProductDirectionEnum

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsUUID('4')
	modelId?: string

	@ApiPropertyOptional({ type: BigInt })
	@IsOptional()
	@IsIntOrBigInt()
	price?: bigint

	@ApiPropertyOptional({ type: BigInt })
	@IsOptional()
	@IsIntOrBigInt()
	priceWithSale?: bigint

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsString()
	@IsPublicId()
	publicId?: string

	@ApiPropertyOptional({ type: Number })
	@IsOptional()
	@IsNumber()
	quantity?: number

	@ApiPropertyOptional({ type: Number })
	@IsOptional()
	@IsNumber()
	sale?: number

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsUUID('4')
	staffId?: string

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsString()
	tissue?: string

	@ApiPropertyOptional({ type: BigInt })
	@IsOptional()
	@IsIntOrBigInt()
	totalSum?: bigint
}
