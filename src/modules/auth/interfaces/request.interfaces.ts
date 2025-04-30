import { GlobalResponse } from '@common'
import { PartnerOptional, PartnerRequired } from '../../partner'

export declare interface UserSignInRequest extends Pick<PartnerRequired, 'password' | 'phone'> {}

export declare interface AuthModifyResponse extends GlobalResponse {
	data: null
}

export declare interface AuthSignOutRequest {
	user: PartnerOptional
}

export declare interface AuthGetValidTokensRequest {
	user: PartnerOptional
}
