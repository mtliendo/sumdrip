import { defineFunction } from '@aws-amplify/backend'

export const resizeImage = defineFunction({
	name: 'resize-image',
	runtime: 22,
	entry: './main.ts',
	resourceGroupName: 'storage',
	memoryMB: 512,
	timeoutSeconds: 15,
	layers: {
		sharp: 'sharp:2',
	},
})
