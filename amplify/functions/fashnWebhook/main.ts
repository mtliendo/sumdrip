import { Handler } from 'aws-cdk-lib/aws-lambda'
import { env } from '$amplify/env/fashn-webhook'
import { events } from 'aws-amplify/data'
import { Amplify } from 'aws-amplify'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client()

Amplify.configure(
	{
		API: {
			Events: {
				endpoint: env.FASHN_EVENT_API_URL,
				region: env.AWS_REGION,
				defaultAuthMode: 'iam',
			},
		},
	},
	{
		Auth: {
			credentialsProvider: {
				getCredentialsAndIdentityId: async () => ({
					credentials: {
						accessKeyId: env.AWS_ACCESS_KEY_ID,
						secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
						sessionToken: env.AWS_SESSION_TOKEN,
					},
				}),
				clearCredentialsAndIdentityId: () => {},
			},
		},
	}
)
type FashnWebhookEvent = {
	id: string
	status: 'completed' | 'failed'
	output: string[]
	error: string | null
}

export const handler: Handler = async (event: { body: string }) => {
	console.log('Event:', event)
	const parsedEvent: FashnWebhookEvent = JSON.parse(event.body)
	try {
		await events.post(`fashn/${parsedEvent.id}`, parsedEvent)

		const response = await fetch(parsedEvent.output[0])
		const imageBuffer = await response.arrayBuffer()

		const command = new PutObjectCommand({
			Bucket: env.SUMDRIP_BUCKET_NAME,
			Key: `stylist-images/generated-content/${parsedEvent.id}.jpeg`,
			Body: Buffer.from(imageBuffer),
			ContentType: 'image/jpeg',
		})
		await s3Client.send(command)
	} catch (error) {
		console.error('Error publishing event:', error)
	}
	return {
		success: true,
	}
}
