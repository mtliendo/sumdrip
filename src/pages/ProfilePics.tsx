import { useState } from 'react'
import { useNavigate } from 'react-router'

function ProfilePics() {
	const navigate = useNavigate()
	const [frontImage, setFrontImage] = useState<File | null>(null)
	const [halfBodyImage, setHalfBodyImage] = useState<File | null>(null)
	const [frontImagePreview, setFrontImagePreview] = useState<string | null>(
		null
	)
	const [halfBodyImagePreview, setHalfBodyImagePreview] = useState<
		string | null
	>(null)

	const handleFrontImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]
			setFrontImage(file)
			setFrontImagePreview(URL.createObjectURL(file))
		}
	}

	const handleHalfBodyImageChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]
			setHalfBodyImage(file)
			setHalfBodyImagePreview(URL.createObjectURL(file))
		}
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		console.log('Front Image:', frontImage)
		console.log('Half-Body Image:', halfBodyImage)

		navigate('/thank-you')
	}

	return (
		<div className="container mx-auto px-4 py-8 mb-16 max-w-4xl">
			<div className="text-center mb-10">
				<h1 className="text-4xl font-bold mb-4">Upload Your Photos</h1>
				<p className="text-xl">
					These help our stylists understand your body type and style better
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-8">
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
						For best results, take photos in a well-lit area standing in front
						of a plain background.
					</span>
				</div>

				{/* Full Body Image Upload */}
				<div className="bg-base-200 p-6 rounded-lg shadow-md">
					<h2 className="text-2xl font-bold mb-4">Full Body Frontal Image</h2>
					<p className="mb-6">
						This helps us see your overall body shape and proportions
					</p>

					<div className="flex flex-col items-center">
						<div className="flex justify-center items-center w-full">
							<label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-base-100 hover:bg-base-300 transition-colors">
								<div className="flex flex-col items-center justify-center pt-5 pb-6">
									{frontImagePreview ? (
										<img
											src={frontImagePreview}
											alt="Front preview"
											className="max-h-48 object-contain mb-2"
										/>
									) : (
										<>
											<svg
												className="w-10 h-10 mb-4 text-primary"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
												></path>
											</svg>
											<p className="mb-2 text-sm text-base-content">
												<span className="font-semibold">Click to upload</span>{' '}
												or drag and drop
											</p>
											<p className="text-xs text-base-content/70">
												PNG, JPG or JPEG (MAX. 5MB)
											</p>
										</>
									)}
								</div>
								<input
									type="file"
									className="hidden"
									accept="image/*"
									onChange={handleFrontImageChange}
									required
								/>
							</label>
						</div>
						{frontImagePreview && frontImage && (
							<span className="mt-2 text-sm text-base-content/70">
								{frontImage.name} (
								{(frontImage.size / (1024 * 1024)).toFixed(2)} MB)
							</span>
						)}
					</div>
				</div>

				{/* Half Body Image Upload */}
				<div className="bg-base-200 p-6 rounded-lg shadow-md">
					<h2 className="text-2xl font-bold mb-4">Half Body Frontal Image</h2>
					<p className="mb-6">
						This helps us see the details of your face and upper body
					</p>

					<div className="flex flex-col items-center">
						<div className="flex justify-center items-center w-full">
							<label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-base-100 hover:bg-base-300 transition-colors">
								<div className="flex flex-col items-center justify-center pt-5 pb-6">
									{halfBodyImagePreview ? (
										<img
											src={halfBodyImagePreview}
											alt="Half body preview"
											className="max-h-48 object-contain mb-2"
										/>
									) : (
										<>
											<svg
												className="w-10 h-10 mb-4 text-primary"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
												></path>
											</svg>
											<p className="mb-2 text-sm text-base-content">
												<span className="font-semibold">Click to upload</span>{' '}
												or drag and drop
											</p>
											<p className="text-xs text-base-content/70">
												PNG, JPG or JPEG (MAX. 5MB)
											</p>
										</>
									)}
								</div>
								<input
									type="file"
									className="hidden"
									accept="image/*"
									onChange={handleHalfBodyImageChange}
									required
								/>
							</label>
						</div>
						{halfBodyImagePreview && halfBodyImage && (
							<span className="mt-2 text-sm text-base-content/70">
								{halfBodyImage.name} (
								{(halfBodyImage.size / (1024 * 1024)).toFixed(2)} MB)
							</span>
						)}
					</div>
				</div>

				<div className="flex justify-center mt-8">
					<button
						type="submit"
						className="btn btn-primary btn-lg"
						disabled={!frontImage || !halfBodyImage}
					>
						Continue
					</button>
				</div>
			</form>
		</div>
	)
}

export default ProfilePics
