import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger'
import { PaymentFindManyData, PaymentFindManyResponse, PaymentFindOneData, PaymentFindOneResponse, PaymentModifyResposne } from '../interfaces'
import { GlobalModifyResponseDto, GlobalResponseDto, PaginationResponseDto } from '@common'
import { PaymentRequiredDto } from './fields.dtos'

export class PaymentFindOneDataDto extends PickType(PaymentRequiredDto, ['id', 'sum', 'createdAt']) implements PaymentFindOneData {}

export class PaymentFindManyDataDto extends PaginationResponseDto implements PaymentFindManyData {
	@ApiProperty({ type: PaymentFindOneDataDto, isArray: true })
	data: PaymentFindOneData[]
}

export class PaymentFindManyResponseDto extends GlobalResponseDto implements PaymentFindManyResponse {
	@ApiProperty({ type: PaymentFindManyDataDto })
	data: PaymentFindManyData
}

export class PaymentFindOneResponseDto extends GlobalResponseDto implements PaymentFindOneResponse {
	@ApiProperty({ type: PaymentFindOneDataDto })
	data: PaymentFindOneData
}

export class PaymentModifyResponseDto extends IntersectionType(GlobalResponseDto, GlobalModifyResponseDto) implements PaymentModifyResposne {}
