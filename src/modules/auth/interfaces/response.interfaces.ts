import { GlobalResponse } from '@common'
import { PartnerOptional } from '../../partner'
import { Tokens } from './tokens.interfaces'

export declare interface PartnerSignInData {
	user: PartnerOptional
	tokens: Tokens
}

export declare interface PartnerSignInResponse extends GlobalResponse {
	data: PartnerSignInData
}
