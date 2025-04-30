import { GlobalResponse } from '../../../common'

export declare interface PublicIdSearchData {
	isUsable: boolean
	exists: boolean
}

export declare interface PublicIdSearchResponse extends GlobalResponse {
	data: PublicIdSearchData
}

export declare interface PublicIdGenerateData {
	id: string
}

export declare interface PublicIdGenerateResponse extends GlobalResponse {
	data: PublicIdGenerateData
}
