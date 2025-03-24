import type { S3Handler } from 'aws-lambda'
import sharp from 'sharp'
import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
} from '@aws-sdk/client-s3'
import { env } from '$amplify/env/resize-image'

const s3Client = new S3Client()
export const handler: S3Handler = async (event) => {
	const objectKeys = event.Records.map((record) => record.s3.object.key)
	console.log(`Upload handler invoked for objects [${objectKeys.join(', ')}]`)

	for (const key of objectKeys) {
		//fetch the image from s3
		const decodedKey = decodeURIComponent(key)
		console.log(`Fetching image from s3 for key: ${decodedKey}`)
		const image = await s3Client.send(
			new GetObjectCommand({
				Bucket: env.SUMDRIP_BUCKET_NAME,
				Key: decodedKey,
			})
		)

		// convert the image to a buffer
		const imageBuffer = await image.Body?.transformToByteArray()

		if (!imageBuffer) {
			console.error(`No image buffer found for key: ${key}`)
			continue
		}

		// resize the image
		const resizedImageBuffer = await sharp(imageBuffer)
			.resize({ width: 2000, height: 2000, fit: 'inside' })
			.toFormat('jpeg', { quality: 95 })
			.toBuffer()

		// store the resized image in s3
		const command = new PutObjectCommand({
			Bucket: env.SUMDRIP_BUCKET_NAME,
			Key: `resized/${decodedKey}`,
			Body: resizedImageBuffer,
		})
		await s3Client.send(command)
	}
}
