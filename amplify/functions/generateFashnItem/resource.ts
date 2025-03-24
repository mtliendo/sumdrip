import { defineFunction, secret } from '@aws-amplify/backend'

export const generateFashionItem = defineFunction({
	name: 'generate-fashion-item',
	runtime: 22,
	entry: './main.ts',
	resourceGroupName: 'data',
	memoryMB: 512,
	timeoutSeconds: 5,
	environment: {
		SUM_DRIP_FASHN_API_KEY: secret('SUM_DRIP_FASHN_API_KEY'),
	},
})
