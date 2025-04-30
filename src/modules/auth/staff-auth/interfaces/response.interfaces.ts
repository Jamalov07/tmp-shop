import { GlobalResponse } from '@common'
import { StaffOptional } from '../../../staff'
import { Tokens } from '../../interfaces'

export declare interface StaffSignInData {
	staff: StaffOptional
	tokens: Tokens
}

export declare interface StaffSignInResponse extends GlobalResponse {
	data: StaffSignInData
}
