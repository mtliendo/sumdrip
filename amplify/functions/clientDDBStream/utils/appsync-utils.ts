import { type Schema } from '../../../data/resource'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { env } from '$amplify/env/clientDDBStream'

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env)

Amplify.configure(resourceConfig, libraryOptions)

const client = generateClient<Schema>()

export const fetchStylist = async () => {
	const stylist = await client.models.Stylist.list()
	return stylist.data[0]
}

export const createRoom = async (
	stylistOwnerId: string,
	clientOwnerId: string,
	clientName: string,
	stylistName: string,
	clientId: string,
	stylistId: string
) => {
	const room = await client.models.Room.create({
		name: `${clientName} and ${stylistName}`,
		owners: [clientOwnerId, stylistOwnerId],
		clientId: clientId,
		stylistId: stylistId,
	})

	return room.data
}
