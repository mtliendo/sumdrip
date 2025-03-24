import { defineFunction, secret } from '@aws-amplify/backend'

export const clientDDBStream = defineFunction({
	name: 'clientDDBStream',
	resourceGroupName: 'data',
	entry: './main.ts',
	runtime: 22,
	environment: {
		SUM_DRIP_RESEND_API_KEY: secret('SUM_DRIP_RESEND_API_KEY'),
	},
})
