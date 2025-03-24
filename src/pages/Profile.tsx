import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react'
import { generateClient } from 'aws-amplify/api'
import { useEffect, useState } from 'react'
import { Schema } from '../../amplify/data/resource'
import ProfileStepIndicator from '../components/ProfileStepIndicator'
import ProfileForm from '../components/ProfileForm'
import ProfilePhotoUpload from '../components/ProfilePhotoUpload'
import { Link } from 'react-router'

const client = generateClient<Schema>()

function Profile() {
	const { user } = useAuthenticator((context) => [context.user])
	const [clientId, setClientId] = useState<string | null>(null)
	const [selectedTraits, setSelectedTraits] = useState<string[]>([])
	const [fullBodyImage, setFullBodyImage] = useState<string | null>(null)
	const [halfBodyImage, setHalfBodyImage] = useState<string | null>(null)
	const [currentStep, setCurrentStep] = useState<'details' | 'photos'>(
		'details'
	)
	const [formData, setFormData] = useState({
		name: '',
		height: '',
		weight: '',
		waist: '',
		inseam: '',
		bust: '',
		hips: '',
		instagram: '',
		additionalDetails: '',
	})
	const [isUpdate, setIsUpdate] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	// Fetch client data on component mount
	useEffect(() => {
		async function fetchClientData() {
			try {
				const result = await client.models.Client.list()
				if (result.data && result.data.length > 0) {
					const clientData = result.data[0]
					console.log(result.data)
					setClientId(clientData.id)
					setFullBodyImage(clientData.fullBodyImage)
					setHalfBodyImage(clientData.halfBodyImage)
					setIsUpdate(true)

					// Populate form with existing data
					setFormData({
						name: clientData.name || '',
						height: clientData.height || '',
						weight: clientData.weight || '',
						waist: clientData.waist || '',
						inseam: clientData.inseam || '',
						bust: clientData.bust || '',
						hips: clientData.hips || '',
						instagram: clientData.instagram || '',
						additionalDetails: clientData.additionalDetails || '',
					})

					if (clientData.traits) {
						// Ensure traits are all strings
						setSelectedTraits(
							clientData.traits.filter(
								(trait) => typeof trait === 'string'
							) as string[]
						)
					}
				}
			} catch (error) {
				console.error('Error fetching client data:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchClientData()
	}, [])

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

	const handleDetailsSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			let resultId = clientId

			if (isUpdate && clientId) {
				// Update existing client
				const res = await client.models.Client.update({
					id: clientId,
					...formData,
					traits: selectedTraits,
				})
				console.log('Client updated:', res.data)
				resultId = res.data?.id || null
			} else {
				// Create new client
				const res = await client.models.Client.create({
					email: user.signInDetails?.loginId as string,
					...formData,
					traits: selectedTraits,
				})
				console.log('Client created:', res.data)
				resultId = res.data?.id || null
			}

			if (resultId) {
				setClientId(resultId)
				setCurrentStep('photos')
			}
		} catch (error) {
			console.error('Error saving client:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleImageUpload = (
		imageType: 'fullBodyImage' | 'halfBodyImage',
		fileInfo: { key?: string | undefined }
	) => {
		console.log('Image Upload:', fileInfo)
		console.log('Image Type:', imageType)

		if (clientId && fileInfo.key) {
			client.models.Client.update({
				id: clientId,
				[imageType]: fileInfo.key,
			})
			if (imageType === 'fullBodyImage') {
				setFullBodyImage(fileInfo.key)
			} else if (imageType === 'halfBodyImage') {
				setHalfBodyImage(fileInfo.key)
			}
		}
	}

	// Show loading state
	if (isLoading) {
		return (
			<Authenticator className="h-screen">
				<div className="flex justify-center items-center h-screen">
					<div className="loading loading-spinner loading-lg"></div>
				</div>
			</Authenticator>
		)
	}

	return (
		<Authenticator className="h-screen">
			<div className="container mx-auto px-4 py-8 mb-16 max-w-4xl">
				<div className="text-center mb-10">
					<h1 className="text-4xl font-bold mb-4">Your Style Profile</h1>
					<p className="text-xl">
						{currentStep === 'details'
							? 'Tell us about your style preferences'
							: 'Upload photos to help our stylists understand your style better'}
					</p>
				</div>

				{/* Step Indicator Component */}
				<ProfileStepIndicator currentStep={currentStep} />

				{/* Conditionally render the form or photo upload component */}
				{currentStep === 'details' ? (
					<ProfileForm
						formData={formData}
						selectedTraits={selectedTraits}
						handleInputChange={handleInputChange}
						handleTraitClick={handleTraitClick}
						handleDetailsSubmit={handleDetailsSubmit}
					/>
				) : (
					<ProfilePhotoUpload
						handleImageUpload={handleImageUpload}
						setCurrentStep={setCurrentStep}
						fullBodyImage={fullBodyImage}
						halfBodyImage={halfBodyImage}
					/>
				)}
				{/* Back to Details and Save Profile Buttons */}
				{currentStep === 'photos' && (
					<div className="flex justify-between mt-8">
						<button
							onClick={() => setCurrentStep('details')}
							className="btn btn-outline"
						>
							Back to Details
						</button>
						<Link to="/thank-you" className="btn btn-primary btn-lg">
							Save Profile
						</Link>
					</div>
				)}
			</div>
		</Authenticator>
	)
}

export default Profile
