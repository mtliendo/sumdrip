import { Schema } from '../../data/resource'
import { env } from '$amplify/env/generate-fashion-item'

export const handler: Schema['generateFashionImage']['functionHandler'] =
	async (event) => {
		// your function code goes here
		const baseUrl = event.arguments.baseImageUrl
		const garmentUrl = event.arguments.garmentImageUrl
		console.log('Event:', event)

		console.log('Base URL:', baseUrl)
		console.log('Garment URL:', garmentUrl)

		const response = await fetch(
			`https://api.fashn.ai/v1/run?webhook_url=${env.FASHN_WEBHOOK_URL}`,
			{
				method: 'POST',
				body: JSON.stringify({
					model_image: baseUrl,
					garment_image: garmentUrl,
					category: 'auto',
				}),
				headers: {
					Authorization: `Bearer ${env.SUM_DRIP_FASHN_API_KEY}`,
					'Content-Type': 'application/json',
				},
			}
		)

		const data = await response.json()

		console.log('Response:', data)

		if (response.ok) {
			return {
				success: true,
				id: data.id,
			}
		} else {
			return {
				success: false,
			}
		}
	}
