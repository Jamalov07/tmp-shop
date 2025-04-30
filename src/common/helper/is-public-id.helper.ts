import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

export function IsPublicId(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'isPublicId',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: any, _args: ValidationArguments) {
					const publicIdRegex = /^[A-Z]{2}\d{6}$/
					return typeof value === 'string' && publicIdRegex.test(value)
				},
				defaultMessage(_args: ValidationArguments) {
					return `$property may only contain 2 uppercase letters followed by 6 digits (e.g., AF123456)`
				},
			},
		})
	}
}
