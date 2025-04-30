import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger'
import { OrderFindManyData, OrderFindManyResponse, OrderFindOneData, OrderFindOneResponse, OrderModifyResposne } from '../interfaces'
import { GlobalModifyResponseDto, GlobalResponseDto, PaginationResponseDto } from '@common'
import { OrderRequiredDto } from './fields.dtos'
import { OrderProductFindOneData, OrderProductFindOneDataDto } from '../../order-product'
import { PartnerFindOneData, PartnerFindOneDataDto } from '../../partner'
import { PaymentFindOneData, PaymentFindOneDataDto } from '../../payment'

export class OrderFindOneDataDto
	extends PickType(OrderRequiredDto, ['id', 'deliveryAddress', 'purchaseStatus', 'deliveryDate', 'createdAt', 'purchaseStatus', 'status'])
	implements OrderFindOneData
{
	@ApiProperty({ type: PartnerFindOneDataDto })
	client?: PartnerFindOneData

	@ApiProperty({ type: PaymentFindOneDataDto, isArray: true })
	payments?: PaymentFindOneData[]

	@ApiProperty({ type: OrderProductFindOneDataDto, isArray: true })
	products?: OrderProductFindOneData[]
}

export class OrderFindManyDataDto extends PaginationResponseDto implements OrderFindManyData {
	@ApiProperty({ type: OrderFindOneDataDto, isArray: true })
	data: OrderFindOneData[]
}

export class OrderFindManyResponseDto extends GlobalResponseDto implements OrderFindManyResponse {
	@ApiProperty({ type: OrderFindManyDataDto })
	data: OrderFindManyData
}

export class OrderFindOneResponseDto extends GlobalResponseDto implements OrderFindOneResponse {
	@ApiProperty({ type: OrderFindOneDataDto })
	data: OrderFindOneData
}

export class OrderModifyResponseDto extends IntersectionType(GlobalResponseDto, GlobalModifyResponseDto) implements OrderModifyResposne {}
