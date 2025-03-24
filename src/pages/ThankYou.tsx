import { Authenticator } from '@aws-amplify/ui-react'
import { useNavigate } from 'react-router'
import { generateClient } from 'aws-amplify/api'
import { Schema } from '../../amplify/data/resource'
import { useEffect, useState } from 'react'

const client = generateClient<Schema>()

function ThankYou() {
	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState(false)
	const [roomId, setRoomId] = useState<string | null>(null)

	// Fetch client and room on mount
	useEffect(() => {
		async function fetchClientAndRoom() {
			setIsLoading(true)
			try {
				const clientsResult = await client.models.Client.list()
				if (clientsResult.data && clientsResult.data.length > 0) {
					const clientId = clientsResult.data[0].id

					// Get rooms for this client
					const roomsResult = await client.models.Room.list({
						filter: { clientId: { eq: clientId } },
					})

					if (roomsResult.data && roomsResult.data.length > 0) {
						setRoomId(roomsResult.data[0].id)
					}
				}
			} catch (error) {
				console.error('Error fetching data:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchClientAndRoom()
	}, [])

	const handleViewChat = () => {
		if (roomId) {
			navigate(`/rooms/${roomId}`)
		}
	}

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
			<div className="hero min-h-screen bg-base-200">
				<div className="hero-content text-center">
					<div className="max-w-md">
						<div className="mb-8">
							<div className="inline-block p-4 bg-success text-white rounded-full">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-24 w-24"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
						</div>
						<h1 className="text-5xl font-bold">Thank You!</h1>
						{roomId ? (
							<>
								<p className="py-6 text-xl">
									Your style profile is complete. Our wardrobe specialist will
									review your information and reach out with personalized
									recommendations soon.
								</p>
								<p className="mb-8">
									You can chat with your wardrobe specialist anytime by clicking
									the button below.
								</p>
								<button
									onClick={handleViewChat}
									className="btn btn-primary btn-lg"
								>
									View Chat
								</button>
							</>
						) : (
							<>
								<p className="py-6 text-xl">
									Your style profile is complete. Thank you for taking the time
									to share your preferences.
								</p>
								<p className="mb-8">
									You will receive an email once a stylist has reviewed your
									profile and is ready to chat with you about creating your
									personalized wardrobe. Be sure to check your spam folder if
									you don't see an email within 24 hours.
								</p>
							</>
						)}
					</div>
				</div>
			</div>
		</Authenticator>
	)
}

export default ThankYou
