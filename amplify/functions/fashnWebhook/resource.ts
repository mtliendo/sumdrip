import { defineFunction } from '@aws-amplify/backend'

export const fashnWebhook = defineFunction({
	name: 'fashn-webhook',
	runtime: 22,
	entry: './main.ts',
	resourceGroupName: 'data',
})
