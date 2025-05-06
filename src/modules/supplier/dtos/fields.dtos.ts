import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { DefaultOptionalFieldsDto, DefaultRequiredFieldsDto, IsIntOrBigInt } from '../../../common'
import { SupplierOptional, SupplierRequired } from '../interfaces'
import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator'

export class SupplierRequiredDto extends PickType(DefaultRequiredFieldsDto, ['id', 'createdAt', 'updatedAt', 'deletedAt']) implements SupplierRequired {
	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsPhoneNumber('UZ')
	phone: string

	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsString()
	fullname: string

	@ApiProperty({ type: BigInt })
	@IsNotEmpty()
	@IsIntOrBigInt()
	balance: bigint
}

export class SupplierOptionalDto extends PickType(DefaultOptionalFieldsDto, ['id', 'createdAt', 'updatedAt', 'deletedAt']) implements SupplierOptional {
	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsPhoneNumber('UZ')
	phone?: string = undefined

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsString()
	fullname?: string = ''

	@ApiPropertyOptional({ type: BigInt })
	@IsOptional()
	@IsIntOrBigInt()
	balance?: bigint
}
