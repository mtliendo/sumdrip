import { StorageImage } from '@aws-amplify/ui-react-storage'
import { getUrl } from 'aws-amplify/storage'
import { useEffect, useState } from 'react'
import { Schema } from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import { events } from 'aws-amplify/data'
import { useParams } from 'react-router'

const client = generateClient<Schema>()

interface UserImage {
	id: string
	url: string
	type: string
}

interface CreateOutfitProps {
	userImages: UserImage[]
}

function CreateOutfit({ userImages }: CreateOutfitProps) {
	const [isUploading, setIsUploading] = useState(false)
	const [selectedImage, setSelectedImage] = useState<string | null>(null)
	const [isGenerating, setIsGenerating] = useState(false)
	const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
		null
	)
	const [isSendingToChat, setIsSendingToChat] = useState(false)
	const { roomId } = useParams<{ roomId: string }>()
	const [catalogImages, setCatalogImages] = useState<
		Schema['Catalog']['type'][]
	>([])
	const [selectedGarment, setSelectedGarment] = useState<
		Schema['Catalog']['type'] | null
	>(null)
	const [isGarmentImageLoading, setIsGarmentImageLoading] = useState(false)

	const handleImageSelect = (imagePath: string) => {
		console.log('imagePath', imagePath)
		setSelectedImage(imagePath)
	}

	useEffect(() => {
		async function listCatalogImages() {
			const images = await client.models.Catalog.list()
			console.log('images', images)
			setCatalogImages(images.data)
		}
		listCatalogImages()
	}, [])

	const handleSendToChat = async () => {
		if (!generatedImageUrl || !roomId || isSendingToChat) return

		setIsSendingToChat(true)
		try {
			await client.models.Message.create({
				text: 'Generated outfit suggestion',
				roomId: roomId,
				imageId: generatedImageUrl,
				userType: 'stylist',
			})
			// Clear the generated image after sending
			setGeneratedImageUrl(null)
		} catch (error) {
			console.error('Error sending generated image to chat:', error)
		} finally {
			setIsSendingToChat(false)
		}
	}

	const handleCreateOutfit = async () => {
		setIsUploading(true)
		setIsGenerating(true)

		try {
			const baseImage = await getUrl({
				path: `resized/${selectedImage}`,
				options: {
					expiresIn: 3600,
				},
			})
			const garmentImage = await getUrl({
				path: `resized/${selectedGarment?.imageId}`,
				options: {
					expiresIn: 3600,
				},
			})
			const baseImageUrl = baseImage.url.toString()
			const garmentImageUrl = garmentImage.url.toString()

			const result = await client.mutations.generateFashionImage({
				baseImageUrl: baseImageUrl,
				garmentImageUrl: garmentImageUrl,
			})

			const fashionId = result.data?.id
			console.log('Fashion generation initiated with ID:', fashionId)

			if (fashionId) {
				const channel = await events.connect(`fashn/${fashionId}`)

				channel.subscribe({
					next: (data) => {
						console.log('Received fashion generation result:', data)
						const generatedImageUrl = data.event.output[0]
						console.log('Setting generatedImageUrl to:', generatedImageUrl)
						setGeneratedImageUrl(generatedImageUrl)
						channel.close()
						setIsGenerating(false)
					},
					error: (err) => {
						console.error('Error in fashion generation subscription:', err)
						channel.close()
						setIsGenerating(false)
					},
				})
			}
		} catch (error) {
			console.error('Error generating outfit:', error)
			setIsGenerating(false)
		} finally {
			setIsUploading(false)
		}
	}

	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-y-auto px-4 pt-4">
				<div className="mb-6">
					<h3 className="font-medium mb-2">Select Base Image</h3>
					<div className="grid grid-cols-2 gap-2">
						{userImages.map((image) => (
							<div
								key={image.id}
								className={`aspect-square rounded-lg overflow-hidden cursor-pointer ${
									selectedImage === image.url ? 'ring-2 ring-primary' : ''
								}`}
								onClick={() => handleImageSelect(image.url)}
							>
								<StorageImage
									path={`resized/${image.url}`}
									alt={image.type}
									className="w-full h-full object-cover"
								/>
							</div>
						))}
					</div>
				</div>

				<div className="mb-6">
					<h3 className="font-medium mb-2">Select Garment</h3>
					<select
						className="select select-bordered w-full mb-4"
						onChange={(e) => {
							const selected = catalogImages.find(
								(img) => img.id === e.target.value
							)
							setSelectedGarment(selected || null)
						}}
						value={selectedGarment?.id || ''}
					>
						<option value="">Select a garment</option>
						{catalogImages.map((image) => (
							<option key={image.id} value={image.id}>
								{image.name}
							</option>
						))}
					</select>

					{selectedGarment && (
						<div className="aspect-square rounded-lg overflow-hidden relative">
							{isGarmentImageLoading && (
								<div className="absolute inset-0 flex items-center justify-center bg-base-200">
									<div className="loading loading-spinner loading-md"></div>
								</div>
							)}
							<StorageImage
								path={`resized/${selectedGarment.imageId}`}
								alt={selectedGarment.name}
								className="w-full h-full object-cover"
								onLoadStart={() => setIsGarmentImageLoading(true)}
								onLoad={() => setIsGarmentImageLoading(false)}
							/>
						</div>
					)}
				</div>

				<div className="mb-6">
					<button
						className="btn btn-primary btn-sm w-full mb-2"
						onClick={handleCreateOutfit}
						disabled={
							isUploading || isGenerating || !selectedImage || !selectedGarment
						}
					>
						{(isUploading || isGenerating) && (
							<span className="loading loading-spinner"></span>
						)}
						{isUploading
							? 'Uploading...'
							: isGenerating
								? 'Generating...'
								: 'Generate Outfit'}
					</button>

					{generatedImageUrl && (
						<div className="aspect-square rounded-lg overflow-hidden mb-2">
							<img
								src={generatedImageUrl}
								alt="Generated outfit"
								className="w-full h-full object-cover"
								onLoad={() =>
									console.log('Generated image loaded successfully')
								}
								onError={(e) =>
									console.error('Error loading generated image:', e)
								}
							/>
						</div>
					)}

					<button
						className="btn btn-secondary btn-sm w-full"
						onClick={handleSendToChat}
						disabled={!generatedImageUrl || isSendingToChat}
					>
						{isSendingToChat ? (
							<>
								<span className="loading loading-spinner loading-xs"></span>
								Sending...
							</>
						) : generatedImageUrl ? (
							'Send to Chat'
						) : (
							'Generate an outfit first'
						)}
					</button>
				</div>
			</div>
		</div>
	)
}

export default CreateOutfit
