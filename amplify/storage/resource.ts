import { defineStorage } from '@aws-amplify/backend'

export const storage = defineStorage({
	name: 'sumdrip',
	access: (allow) => ({
		'client-images/full-body/{entity_id}/*': [
			allow.entity('identity').to(['read', 'write', 'delete']),
			allow.groups(['stylist']).to(['read']),
		],
		'client-images/half-body/{entity_id}/*': [
			allow.entity('identity').to(['read', 'write', 'delete']),
			allow.groups(['stylist']).to(['read']),
		],
	}),
})
