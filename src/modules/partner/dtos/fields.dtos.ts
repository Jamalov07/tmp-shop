import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DefaultOptionalFieldsDto, DefaultRequiredFieldsDto, IsIntOrBigInt } from '../../../common'
import { PartnerOptional, PartnerRequired } from '../interfaces'
import { IsJWT, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator'

export class PartnerRequiredDto extends DefaultRequiredFieldsDto implements PartnerRequired {
	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsString()
	fullname: string

	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsIntOrBigInt()
	balance: bigint

	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsString()
	password: string

	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsPhoneNumber('UZ')
	phone: string

	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsJWT()
	token: string

	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsString()
	whereFrom: string
}

export class PartnerOptionalDto extends DefaultOptionalFieldsDto implements PartnerOptional {
	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsString()
	fullname?: string

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsIntOrBigInt()
	balance?: bigint

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsString()
	password?: string

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsPhoneNumber('UZ')
	phone?: string

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsJWT()
	token?: string

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsString()
	whereFrom?: string
}
