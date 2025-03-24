import React from 'react'
import { FileUploader, StorageImage } from '@aws-amplify/ui-react-storage'

type ProfilePhotoUploadProps = {
	handleImageUpload: (
		imageType: 'fullBodyImage' | 'halfBodyImage',
		fileInfo: { key?: string | undefined }
	) => void
	setCurrentStep: (step: 'details' | 'photos') => void
	fullBodyImage: string | null
	halfBodyImage: string | null
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
	handleImageUpload,
	fullBodyImage,
	halfBodyImage,
}) => {
	return (
		<div className="space-y-8">
			{/* Photo Upload Instructions */}
			<div className="alert alert-info mb-8">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					className="stroke-current shrink-0 w-6 h-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
				<span>
					For best results, take photos in a well-lit area standing in front of
					a plain background.
				</span>
			</div>

			{/* Full Body Image Upload */}
			<div className="bg-base-200 p-6 rounded-lg shadow-md">
				<h2 className="text-2xl font-bold mb-4">Full Body Frontal Image</h2>
				<p className="mb-6">
					This helps us see your overall body shape and proportions
				</p>

				<FileUploader
					acceptedFileTypes={['image/*']}
					path={({ identityId }) => `client-images/full-body/${identityId}/`}
					maxFileCount={1}
					onUploadSuccess={(fileInfo) =>
						handleImageUpload('fullBodyImage', fileInfo)
					}
				/>
				{fullBodyImage && (
					<StorageImage
						path={fullBodyImage}
						alt="Full Body Image"
						style={{ width: '200px', height: 'auto' }}
					/>
				)}
			</div>

			{/* Half Body Image Upload */}
			<div className="bg-base-200 p-6 rounded-lg shadow-md">
				<h2 className="text-2xl font-bold mb-4">Half Body Frontal Image</h2>
				<p className="mb-6">
					This helps us see the details of your face and upper body
				</p>

				<FileUploader
					acceptedFileTypes={['image/*']}
					path={({ identityId }) => `client-images/half-body/${identityId}/`}
					maxFileCount={1}
					onUploadSuccess={(fileInfo) =>
						handleImageUpload('halfBodyImage', fileInfo)
					}
				/>
				{halfBodyImage && (
					<StorageImage
						path={halfBodyImage}
						alt="Half Body Image"
						style={{ width: '200px', height: 'auto' }}
					/>
				)}
			</div>
		</div>
	)
}

export default ProfilePhotoUpload
