import { FileUploader, StorageImage } from '@aws-amplify/ui-react-storage'
import { getUrl } from 'aws-amplify/storage'
import { useState } from 'react'

interface UserImage {
	id: string
	url: string
	type: string
}

interface CreateOutfitProps {
	userImages: UserImage[]
	onOutfitGenerated: (outfitCompositionURLs: Record<string, string>) => void
	generatedOutfit: string | null
}

function CreateOutfit({
	userImages,
	onOutfitGenerated,
	generatedOutfit,
}: CreateOutfitProps) {
	const [isUploading, setIsUploading] = useState(false)
	const [selectedImage, setSelectedImage] = useState<string | null>(null)
	const [uploadedImage, setUploadedImage] = useState<string | null>(null)
	const [outfitCompositionURLs, setOutfitCompositionURLs] = useState<
		Record<string, string>
	>({
		base: '',
		garment: '',
	})

	const handleImageSelect = (imagePath: string) => {
		console.log('imagePath', imagePath)
		setSelectedImage(imagePath)
	}

	const handleCreateOutfit = async () => {
		if (!selectedImage) {
			alert('Please select a base image first')
			return
		}

		if (!uploadedImage) {
			alert('Please upload your image')
			return
		}

		setIsUploading(true)

		try {
			const baseImage = await getUrl({
				path: selectedImage,
			})
			const garmentImage = await getUrl({
				path: uploadedImage,
			})

			console.log('baseImage', baseImage)
			console.log('garmentImage', garmentImage)
			console.log('baseImageUrl', baseImage.url.toString())
			console.log('garmentImageUrl', garmentImage.url.toString())
			setOutfitCompositionURLs({
				base: baseImage.url.toString(),
				garment: garmentImage.url.toString(),
			})
		} catch (error) {
			console.error('Error generating outfit:', error)
		} finally {
			setIsUploading(false)
		}
	}

	const handleSendOutfit = () => {
		if (outfitCompositionURLs) {
			onOutfitGenerated(outfitCompositionURLs)
			setOutfitCompositionURLs({
				base: '',
				garment: '',
			})
			setSelectedImage(null)
			setUploadedImage(null)
		}
	}

	const handleUploadSuccess = (result: { key?: string }) => {
		console.log('Upload successful:', result)
		if (result.key) {
			setUploadedImage(result.key)
		}
	}

	return (
		<div className="p-4 overflow-y-auto flex-grow">
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
								path={image.url}
								alt={image.type}
								className="w-full h-full object-cover"
							/>
						</div>
					))}
				</div>
			</div>

			<div className="mb-6">
				<h3 className="font-medium mb-2">Upload Your Image</h3>
				<FileUploader
					path={'stylist-images/catalog/'}
					acceptedFileTypes={['image/*']}
					maxFileCount={1}
					onUploadSuccess={handleUploadSuccess}
				/>
			</div>

			<div className="mb-6">
				<button
					className="btn btn-primary btn-sm w-full"
					onClick={handleCreateOutfit}
					disabled={isUploading || !selectedImage || !uploadedImage}
				>
					{isUploading ? 'Generating...' : 'Generate Outfit'}
				</button>

				{generatedOutfit && (
					<div className="mt-2">
						<div className="aspect-square rounded-lg overflow-hidden mb-2">
							<img
								src={
									'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
								}
								alt="Generated outfit"
								className="w-full h-full object-cover"
							/>
						</div>
						<button
							className="btn btn-sm btn-success w-full"
							onClick={handleSendOutfit}
						>
							Send to Chat
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

export default CreateOutfit
