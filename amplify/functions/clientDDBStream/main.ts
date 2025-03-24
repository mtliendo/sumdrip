import type { DynamoDBStreamHandler } from 'aws-lambda'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { AttributeValue } from '@aws-sdk/client-dynamodb'
import { fetchStylist, createRoom } from './utils/appsync-utils'
import { sendEmail } from './utils/resend-api'

export const handler: DynamoDBStreamHandler = async (event) => {
	const batchItemFailures: { itemIdentifier: string }[] = []

	for (const record of event.Records) {
		try {
			// Only process INSERT events
			if (record.eventName !== 'INSERT') {
				console.log(`Skipping non-INSERT event: ${record.eventName}`)
				continue
			}

			if (!record.dynamodb || !record.dynamodb.NewImage) {
				console.warn('Record missing dynamodb.NewImage data:', record.eventID)
				return
			}

			const clientItem = unmarshall(
				record.dynamodb.NewImage as Record<string, AttributeValue>
			)
			console.log('New item:', clientItem)

			try {
				const stylist = await fetchStylist()
				if (!stylist || !stylist.owner) {
					throw new Error('Failed to fetch valid stylist data')
				}
				console.log('Stylist:', stylist)

				if (!clientItem.owner) {
					throw new Error('Client item missing owner field')
				}

				// Create strings with fallbacks
				const stylistOwner = stylist.owner as string
				const clientOwner = clientItem.owner as string
				const clientName = clientItem.name as string
				const stylistName = stylist.name as string

				const room = await createRoom(
					stylistOwner,
					clientOwner,
					clientName,
					stylistName,
					clientItem.id as string,
					stylist.id as string
				)

				if (!room) {
					throw new Error('Failed to create chat room')
				}
				console.log('Room created successfully:', room)

				if (!stylist.email) {
					throw new Error('Stylist email is missing')
				}

				await sendEmail(stylist.email, 'A new client has joined the app.')
				console.log('Email notification sent to stylist')
			} catch (err) {
				console.error(`Error processing record ${record.eventID}:`, err)
			}
		} catch (err) {
			console.error(`Critical error processing record ${record.eventID}:`, err)
		}
	}

	console.log(
		`Processed ${event.Records.length} records with ${batchItemFailures.length} failures`
	)
}
