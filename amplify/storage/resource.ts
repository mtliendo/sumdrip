import { defineStorage } from '@aws-amplify/backend'
import { fashnWebhook } from '../functions/fashnWebhook/resource'
import { resizeImage } from '../functions/resizeImage/resource'

export const storage = defineStorage({
	name: 'sumdrip',
	access: (allow) => ({
		'client-images/full-body/{entity_id}/*': [
			allow.entity('identity').to(['write']),
			allow.resource(resizeImage).to(['read']),
		],
		'client-images/half-body/{entity_id}/*': [
			allow.entity('identity').to(['write']),
			allow.resource(resizeImage).to(['read']),
		],
		'resized/client-images/full-body/{entity_id}/*': [
			allow.entity('identity').to(['read']),
			allow.groups(['stylist']).to(['read']),
			allow.resource(resizeImage).to(['write']),
		],
		'resized/client-images/half-body/{entity_id}/*': [
			allow.entity('identity').to(['read']),
			allow.groups(['stylist']).to(['read']),
			allow.resource(resizeImage).to(['write']),
		],
		'stylist-images/catalog/*': [
			allow.groups(['stylist']).to(['write']),
			allow.resource(resizeImage).to(['read']),
		],
		'resized/stylist-images/catalog/*': [
			allow.groups(['stylist']).to(['read']),
			allow.resource(resizeImage).to(['write']),
		],
		'stylist-images/generated-content/*': [
			allow.groups(['stylist']).to(['read']),
			allow.resource(fashnWebhook).to(['write']),
		],
		'chat-images/*': [
			allow.authenticated.to(['read', 'write']),
			allow.groups(['stylist']).to(['read', 'write']),
			allow.entity('identity').to(['read', 'write']),
		],
	}),
})
