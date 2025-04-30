import { GlobalResponse } from '@common'
import { PartnerOptional, PartnerRequired } from '../../../partner'

export declare interface PartnerSignInRequest extends Pick<PartnerRequired, 'password' | 'phone'> {}

export declare interface AuthModifyResponse extends GlobalResponse {
	data: null
}

export declare interface AuthSignOutRequest {
	partner: PartnerOptional
}

export declare interface AuthGetValidTokensRequest {
	partner: PartnerOptional
}
