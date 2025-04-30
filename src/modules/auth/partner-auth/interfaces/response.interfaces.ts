import { GlobalResponse } from '@common'
import { PartnerOptional } from '../../../partner'
import { Tokens } from '../../interfaces'

export declare interface PartnerSignInData {
	partner: PartnerOptional
	tokens: Tokens
}

export declare interface PartnerSignInResponse extends GlobalResponse {
	data: PartnerSignInData
}
