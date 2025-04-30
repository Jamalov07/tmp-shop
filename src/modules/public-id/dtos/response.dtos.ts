import { ApiProperty } from '@nestjs/swagger'
import { PublicIdGenerateData, PublicIdGenerateResponse, PublicIdSearchData, PublicIdSearchResponse } from '../interfaces'
import { GlobalResponseDto } from '@common'

export class PublicIdSearchDataDto implements PublicIdSearchData {
	@ApiProperty({ type: Boolean })
	exists: boolean

	@ApiProperty({ type: Boolean })
	isUsable: boolean
}

export class PublicIdSearchResponseDto extends GlobalResponseDto implements PublicIdSearchResponse {
	@ApiProperty({ type: PublicIdSearchDataDto })
	data: PublicIdSearchDataDto
}

export class PublicIdGenerateDataDto implements PublicIdGenerateData {
	@ApiProperty({ type: String })
	id: string
}

export class PublicIdGenerateResponseDto extends GlobalResponseDto implements PublicIdGenerateResponse {
	@ApiProperty({ type: PublicIdGenerateDataDto })
	data: PublicIdGenerateDataDto
}
