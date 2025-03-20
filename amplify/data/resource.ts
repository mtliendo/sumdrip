import { type ClientSchema, a, defineData } from '@aws-amplify/backend'

const schema = a.schema({
	Client: a
		.model({
			name: a.string(),
			traits: a.string().array(),
			height: a.string(),
			weight: a.string(),
			waist: a.string(),
			inseam: a.string(),
			bust: a.string(),
			hips: a.string(),
			instagram: a.string(),
			fullBodyImage: a.string(),
			halfBodyImage: a.string(),
			additionalDetails: a.string(),
			messages: a.hasMany('Message', 'clientId'),
			room: a.hasOne('Room', 'clientId'),
		})
		.authorization((allow) => [
			allow.owner(),
			allow.group('stylist').to(['read']),
		]),
	Room: a
		.model({
			name: a.string(),
			clientId: a.string(),
			messages: a.hasMany('Message', 'roomId'),
		})
		.authorization((allow) => [
			allow.owner().to(['read', 'update']),
			allow.group('stylist').to(['read']),
		]),
	Message: a
		.model({
			userType: a.enum(['stylist', 'client']),
			content: a.string(),
			imageId: a.string(),
			roomId: a.string(),
		})
		.authorization((allow) => [allow.owner()]),
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
	name: 'sumdrip',
	schema,
	authorizationModes: {
		defaultAuthorizationMode: 'userPool',
	},
})
