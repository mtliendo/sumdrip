import { useEffect, useState } from 'react'
import ChatWindow from '../components/ChatWindow'
import CreateOutfit from '../components/CreateOutfit'
import { Authenticator } from '@aws-amplify/ui-react'
import { useParams, Navigate } from 'react-router'
import { generateClient } from 'aws-amplify/api'
import { Schema } from '../../amplify/data/resource'
import { uploadData } from 'aws-amplify/storage'
import { useUserGroup } from '../hooks/useUserGroup'

const client = generateClient<Schema>()

function sortMessages(msgs: Message[]) {
	return [...msgs].sort((a, b) => {
		const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
		const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
		return timeA - timeB
	})
}

type Message = {
	id: string
	text?: string
	sender: string
	imageId?: string
	timestamp: string
	roomId?: string
	createdAt: string
}

function Chat() {
	const [messages, setMessages] = useState<Schema['Message']['type'][]>([])
	const [newMessage, setNewMessage] = useState('')
	const [showSidebar, setShowSidebar] = useState(false)
	const { roomId } = useParams<{ roomId: string }>()
	const { isInGroup: isStylist, isLoading } = useUserGroup('stylist')

	const [clientImages, setClientImages] = useState<
		{ id: string; url: string; type: string }[]
	>([])

	// Fetch client images if stylist
	useEffect(() => {
		async function fetchClientData() {
			if (isStylist && roomId) {
				try {
					// Get room to find client ID so we can get their images
					const roomResult = await client.models.Room.get({ id: roomId })
					if (roomResult.data) {
						// Get client data
						const clientResult = await client.models.Client.get({
							id: roomResult.data.clientId!,
						})

						console.log('Client result:', clientResult.data)
						// Build images array
						const images = []
						if (clientResult.data?.fullBodyImage) {
							images.push({
								id: '1',
								url: clientResult.data.fullBodyImage,
								type: 'Full body',
							})
						}
						if (clientResult.data?.halfBodyImage) {
							images.push({
								id: '2',
								url: clientResult.data.halfBodyImage,
								type: 'Half body',
							})
						}
						setClientImages(images)
					}
				} catch (error) {
					console.error('Error fetching client data:', error)
				}
			}
		}

		fetchClientData()
	}, [isStylist, roomId])

	// Fetch messages for room
	useEffect(() => {
		if (roomId) {
			client.models.Room.get(
				{ id: roomId },
				{ selectionSet: ['messages.*'] }
			).then((room) => {
				// Map to our message format with proper type handling

				// Sort messages by createdAt timestamp

				//ignore the type error
				//@ts-expect-error remove this once we have the correct type
				const sorted = sortMessages(room.data?.messages || [])

				//ignore the type error
				//@ts-expect-error remove this once we have the correct type
				setMessages(sorted)
			})
		}
	}, [roomId])

	// Subscribe to new messages
	useEffect(() => {
		if (!roomId) return

		const createSub = client.models.Message.onCreate({
			filter: {
				roomId: {
					eq: roomId,
				},
			},
		}).subscribe({
			next: (data) => {
				const newMsg = data as Schema['Message']['type']

				//ignore the type error
				//@ts-expect-error remove this once we have the correct type
				setMessages((prev) => sortMessages([...prev, newMsg]))
			},
			error: (error) => console.warn(error),
		})

		return () => createSub.unsubscribe()
	}, [roomId])

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault()
		if (newMessage.trim() === '' || !roomId) return

		client.models.Message.create({
			text: newMessage,
			roomId: roomId,
			userType: isStylist ? 'stylist' : 'client',
		})
			.then((result) => {
				console.log('Message sent:', result)
				// We don't need to manually add the message here as it will come through the subscription
				// which now properly sorts messages by createdAt
			})
			.catch((error) => {
				console.error('Error sending message:', error)
			})

		setNewMessage('')
	}

	const handleSendImage = async (imageFile: File) => {
		if (!roomId) return

		try {
			// Generate a unique filename with timestamp and sanitized original name
			const timestamp = Date.now()
			const sanitizedFileName = imageFile.name
				.replace(/\s+/g, '-')
				.toLowerCase()
			const fileName = `${timestamp}-${sanitizedFileName}`

			// Create path using roomId in the directory structure
			const path = `chat-images/${roomId}/${fileName}`

			// Upload the file to S3
			return new Promise<void>((resolve, reject) => {
				uploadData({
					path: path,
					data: imageFile,
					options: {
						onProgress: (progress) => {
							console.log('Upload progress:', progress)
							if (progress.totalBytes === progress.transferredBytes) {
								console.log('Upload completed')
								// Create message after upload is complete
								client.models.Message.create({
									imageId: path,
									roomId: roomId,
									text: 'Image attachment',
									userType: isStylist ? 'stylist' : 'client',
								})
									.then(() => resolve())
									.catch((error) => reject(error))
							}
						},
					},
				})
			})
		} catch (error) {
			console.error('Error uploading image or creating message:', error)
			throw error
		}
	}

	// Redirect if no roomId is present
	if (!roomId && !isLoading) {
		return <Navigate to="/" />
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
			<div className="flex flex-col h-screen">
				<div className="flex flex-col md:flex-row flex-1 bg-base-100 relative">
					{/* Mobile sidebar toggle button (only visible on mobile) */}
					{isStylist && (
						<button
							className="md:hidden absolute top-2 left-2 z-10 btn btn-sm btn-circle"
							onClick={() => setShowSidebar(!showSidebar)}
						>
							{showSidebar ? '×' : '≡'}
						</button>
					)}

					{/* Sidebar - Only visible for stylists */}
					{isStylist && (
						<div
							className={`${
								showSidebar ? 'fixed inset-0 z-50 bg-base-100' : 'hidden'
							} md:relative md:block md:w-80 border-r border-base-300 flex flex-col bg-base-200`}
						>
							<div className="p-4 border-b border-base-300 flex justify-between items-center">
								<h2 className="font-bold text-lg">Client Profile</h2>
								<button
									className="md:hidden btn btn-sm btn-circle"
									onClick={() => setShowSidebar(false)}
								>
									×
								</button>
							</div>

							<CreateOutfit userImages={clientImages} />
						</div>
					)}

					{/* Chat area */}
					<div className="flex-1 overflow-hidden">
						<ChatWindow
							messages={messages}
							newMessage={newMessage}
							setNewMessage={setNewMessage}
							handleSendMessage={handleSendMessage}
							handleSendImage={handleSendImage}
							isStylist={isStylist}
						/>
					</div>
				</div>
			</div>
		</Authenticator>
	)
}

export default Chat
