export declare interface AppConfigOptions {
	port: number
	host: string
}

export declare interface DatabaseConfigOptions {
	url: string
}

export declare interface JwtConfigOptions {
	accessToken: { key: string; time: string }
	refreshToken: { key: string; time: string }
}

export declare interface GoogleCredentialOptions {
	type: string
	project_id: string
	private_key_id: string
	private_key: string
	client_email: string
	client_id: string
	auth_uri: string
	token_uri: string
	auth_provider_x509_cert_url: string
	client_x509_cert_url: string
}
