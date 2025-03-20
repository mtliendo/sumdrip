import { useState, useRef } from 'react'

interface UserImage {
	id: string
	url: string
	type: string
}

interface CreateOutfitProps {
	userImages: UserImage[]
	onOutfitGenerated: (outfitImage: string) => void
}

function CreateOutfit({ userImages, onOutfitGenerated }: CreateOutfitProps) {
	const [isUploading, setIsUploading] = useState(false)
	const [selectedImage, setSelectedImage] = useState<string | null>(null)
	const [uploadedImage, setUploadedImage] = useState<string | null>(null)
	const [generatedOutfit, setGeneratedOutfit] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleImageSelect = (imageUrl: string) => {
		setSelectedImage(imageUrl)
	}

	const handleUploadClick = () => {
		fileInputRef.current?.click()
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]
			const reader = new FileReader()

			reader.onload = (event) => {
				if (event.target?.result) {
					setUploadedImage(event.target.result as string)
				}
			}

			reader.readAsDataURL(file)
		}
	}

	const handleCreateOutfit = () => {
		if (!selectedImage) {
			alert('Please select a base image first')
			return
		}

		if (!uploadedImage) {
			alert('Please upload your image')
			return
		}

		setIsUploading(true)

		// Mock outfit generation based on selected image + uploaded image
		// In a real app, this would call an API with both images
		setTimeout(() => {
			// For demo purposes, we're using a mock image
			const MOCK_OUTFIT_IMAGE =
				'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
			setGeneratedOutfit(MOCK_OUTFIT_IMAGE)
			setIsUploading(false)
		}, 2000)
	}

	const handleSendOutfit = () => {
		if (generatedOutfit) {
			onOutfitGenerated(generatedOutfit)
			setGeneratedOutfit(null)
			setSelectedImage(null)
			setUploadedImage(null)
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
							<img
								src={image.url}
								alt={image.type}
								className="w-full h-full object-cover"
							/>
						</div>
					))}
				</div>
			</div>

			<div className="mb-6">
				<h3 className="font-medium mb-2">Upload Your Image</h3>
				<input
					type="file"
					className="hidden"
					ref={fileInputRef}
					onChange={handleFileChange}
					accept="image/*"
				/>
				<button
					className="btn btn-secondary btn-sm w-full mb-2"
					onClick={handleUploadClick}
				>
					Upload Image
				</button>

				{uploadedImage && (
					<div className="aspect-square rounded-lg overflow-hidden mb-2">
						<img
							src={uploadedImage}
							alt="Uploaded image"
							className="w-full h-full object-cover"
						/>
					</div>
				)}
			</div>

			<div className="mb-6">
				<button
					className="btn btn-primary btn-sm w-full"
					onClick={handleCreateOutfit}
					disabled={isUploading || !selectedImage || !uploadedImage}
				>
					{isUploading ? 'Generating...' : 'Create Outfit'}
				</button>

				{generatedOutfit && (
					<div className="mt-2">
						<div className="aspect-square rounded-lg overflow-hidden mb-2">
							<img
								src={generatedOutfit}
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
