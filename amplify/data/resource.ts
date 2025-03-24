import { type ClientSchema, a, defineData } from '@aws-amplify/backend'
import { clientDDBStream } from '../functions/clientDDBStream/resource'
import { generateFashionItem } from '../functions/generateFashnItem/resource'

const schema = a
	.schema({
		Stylist: a
			.model({
				name: a.string().required(),
				email: a.email().required(),
			})
			.authorization((allow) => [allow.owner().to(['read', 'create'])]),
		Client: a
			.model({
				name: a.string().required(),
				email: a.email().required(),
				traits: a.string().array().required(),
				height: a.string().required(),
				weight: a.string().required(),
				waist: a.string().required(),
				inseam: a.string().required(),
				bust: a.string(),
				hips: a.string(),
				instagram: a.string(),
				fullBodyImage: a.string(),
				halfBodyImage: a.string(),
				additionalDetails: a.string(),
			})
			.authorization((allow) => [
				allow.owner().to(['read', 'create', 'update']),
				allow.group('stylist').to(['read']),
			]),
		Room: a
			.model({
				name: a.string().required(), //* Name of the client and stylist
				messages: a.hasMany('Message', 'roomId'),
				clientId: a.id(),
				stylistId: a.id(),
				owners: a.string().array().required(),
			})
			.authorization((allow) => [
				allow.ownersDefinedIn('owners').to(['read']),
				allow.groups(['stylist']),
			]),
		Message: a
			.model({
				userId: a.string().required(),
				text: a.string(),
				imageId: a.string(),
				roomId: a.string().required(),
				room: a.belongsTo('Room', 'roomId'),
			})
			.authorization((allow) => [
				allow.authenticated().to(['read', 'create']),
				allow.group('stylist').to(['read', 'create']),
			]),
		generateFashionImage: a
			.mutation()
			.arguments({
				baseImageUrl: a.url().required(),
				garmentImageUrl: a.url().required(),
			})
			.returns(a.customType({ success: a.boolean() }))
			.handler(a.handler.function(generateFashionItem))
			.authorization((allow) => [allow.group('stylist')]),
	})
	.authorization((allow) => [allow.resource(clientDDBStream)])

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
	name: 'sumdrip',
	schema,
	authorizationModes: {
		defaultAuthorizationMode: 'userPool',
	},
})
