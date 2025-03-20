import { useState } from 'react'
import { useNavigate } from 'react-router'

function DescribeSelf() {
	const navigate = useNavigate()
	const [selectedTraits, setSelectedTraits] = useState<string[]>([])
	const [formData, setFormData] = useState({
		height: '',
		weight: '',
		waist: '',
		inseam: '',
		bust: '',
		hips: '',
		instagram: '',
		additionalDetails: '',
	})

	const personalityTraits = [
		'Shy',
		'Outgoing',
		'Adventurous',
		'Social Butterfly',
		'Homebody',
		'Funny',
		'Professional',
		'Casual',
		'Artistic',
		'Athletic',
		'Minimalist',
		'Maximalist',
		'Vintage',
		'Modern',
		'Trendy',
		'Classic',
		'Bohemian',
		'Elegant',
		'Edgy',
		'Sophisticated',
	]

	const handleTraitClick = (trait: string) => {
		if (selectedTraits.includes(trait)) {
			setSelectedTraits(selectedTraits.filter((t) => t !== trait))
		} else {
			setSelectedTraits([...selectedTraits, trait])
		}
	}

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setFormData({
			...formData,
			[name]: value,
		})
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		console.log('Selected Traits:', selectedTraits)
		console.log('Form Data:', formData)
		navigate('/profile-pics')
	}

	return (
		<div className="container mx-auto px-4 py-8 mb-16 max-w-4xl">
			<div className="text-center mb-10">
				<h1 className="text-4xl font-bold mb-4">Tell Us About Your Style</h1>
				<p className="text-xl">
					Help us understand your preferences so we can find the perfect outfits
					for you
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-10">
				{/* Personality Traits Section */}
				<div className="bg-base-200 p-6 rounded-lg shadow-md">
					<h2 className="text-2xl font-bold mb-4">
						Select your personality traits
					</h2>
					<p className="mb-4">Choose all that apply to you</p>

					<div className="flex flex-wrap gap-2">
						{personalityTraits.map((trait) => (
							<button
								key={trait}
								type="button"
								className={`badge badge-lg ${
									selectedTraits.includes(trait)
										? 'badge-primary text-white'
										: 'badge-outline'
								} p-4 cursor-pointer transition-all`}
								onClick={() => handleTraitClick(trait)}
							>
								{trait}
							</button>
						))}
					</div>
				</div>

				{/* Dimensions Section */}
				<div className="bg-base-200 p-6 rounded-lg shadow-md">
					<h2 className="text-2xl font-bold mb-4">Tell us your dimensions</h2>
					<p className="mb-6">
						This helps us recommend clothes that fit you perfectly
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="form-control">
							<label className="label">
								<span className="label-text">Height (required)</span>
							</label>
							<input
								type="text"
								name="height"
								value={formData.height}
								onChange={handleInputChange}
								placeholder="e.g. 5'10 or 178cm"
								className="input input-bordered"
								required
							/>
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text">Weight (required)</span>
							</label>
							<input
								type="text"
								name="weight"
								value={formData.weight}
								onChange={handleInputChange}
								placeholder="e.g. 160lbs or 73kg"
								className="input input-bordered"
								required
							/>
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text">Waist (required)</span>
							</label>
							<input
								type="text"
								name="waist"
								value={formData.waist}
								onChange={handleInputChange}
								placeholder="e.g. 32 inches or 81cm"
								className="input input-bordered"
								required
							/>
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text">Inseam (required)</span>
							</label>
							<input
								type="text"
								name="inseam"
								value={formData.inseam}
								onChange={handleInputChange}
								placeholder="e.g. 30 inches or 76cm"
								className="input input-bordered"
								required
							/>
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text">Bust (optional)</span>
							</label>
							<input
								type="text"
								name="bust"
								value={formData.bust}
								onChange={handleInputChange}
								placeholder="e.g. 36 inches or 91cm"
								className="input input-bordered"
							/>
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text">Hips (optional)</span>
							</label>
							<input
								type="text"
								name="hips"
								value={formData.hips}
								onChange={handleInputChange}
								placeholder="e.g. 38 inches or 96cm"
								className="input input-bordered"
							/>
						</div>
					</div>
				</div>

				{/* Social Media Section */}
				<div className="bg-base-200 p-6 rounded-lg shadow-md">
					<h2 className="text-2xl font-bold mb-4">Your Social Media</h2>
					<p className="mb-4">
						This helps our stylists understand your aesthetic better
					</p>

					<div className="form-control">
						<label className="label">
							<span className="label-text">Instagram Handle (optional)</span>
						</label>
						<input
							type="text"
							name="instagram"
							value={formData.instagram}
							onChange={handleInputChange}
							placeholder="@yourusername"
							className="input input-bordered"
						/>
					</div>
				</div>

				{/* Additional Details Section */}
				<div className="bg-base-200 p-6 rounded-lg shadow-md">
					<h2 className="text-2xl font-bold mb-4">Additional Details</h2>
					<p className="mb-4">
						Tell us anything else that might help us understand your style
						preferences
					</p>

					<div className="form-control">
						<textarea
							className="textarea textarea-bordered h-32"
							name="additionalDetails"
							value={formData.additionalDetails}
							onChange={handleInputChange}
							placeholder="Example: I'm looking for a wardrobe refresh for my office job. I prefer earth tones and sustainable brands. I have a wedding coming up in June and would love outfit suggestions."
						></textarea>
					</div>
				</div>

				<div className="flex justify-center">
					<button type="submit" className="btn btn-primary btn-lg">
						Next: Upload Photos
					</button>
				</div>
			</form>
		</div>
	)
}

export default DescribeSelf
