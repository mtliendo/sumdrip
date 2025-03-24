import { useEffect, useState } from 'react'
import ChatWindow from '../components/ChatWindow'
import CreateOutfit from '../components/CreateOutfit'
import { Authenticator } from '@aws-amplify/ui-react'
import { useParams, Navigate } from 'react-router'
import { generateClient } from 'aws-amplify/api'
import { Schema } from '../../amplify/data/resource'
import { fetchAuthSession } from 'aws-amplify/auth'
import { uploadData } from 'aws-amplify/storage'

const client = generateClient<Schema>()

// User and stylist mock data
const MOCK_STYLIST = {
	id: 'stylist',
	name: 'Stylist Liendo',
	avatar: 'https://github.com/mtliendo.png',
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
	const [messages, setMessages] = useState<Message[]>([])
	const [newMessage, setNewMessage] = useState('')
	const [showSidebar, setShowSidebar] = useState(false)
	const { roomId } = useParams<{ roomId: string }>()
	const [isStylist, setIsStylist] = useState(false)
	const [userId, setUserId] = useState<string>('client')
	const [isLoading, setIsLoading] = useState(true)
	const [clientImages, setClientImages] = useState<
		{ id: string; url: string; type: string }[]
	>([])
	const [generatedOutfit, setGeneratedOutfit] = useState<string | null>(null)

	// Helper function to sort messages by createdAt timestamp
	const sortMessages = (msgs: Message[]) => {
		return [...msgs].sort((a, b) => {
			// Ensure we have valid dates before comparison
			const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
			const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
			return timeA - timeB
		})
	}

	// Check if user is stylist and set up user ID
	useEffect(() => {
		async function checkUserRole() {
			try {
				const session = await fetchAuthSession()
				const groups =
					(session.tokens?.idToken?.payload['cognito:groups'] as string[]) || []
				const isStylistUser = groups.includes('stylist')
				setIsStylist(isStylistUser)
				setUserId(isStylistUser ? 'stylist' : 'client')
			} catch (error) {
				console.error('Error checking user role:', error)
			} finally {
				setIsLoading(false)
			}
		}

		checkUserRole()
	}, [])

	// Fetch client images if stylist
	useEffect(() => {
		async function fetchClientData() {
			if (isStylist && roomId) {
				try {
					// Get room to find client ID
					const roomResult = await client.models.Room.get({ id: roomId })
					if (roomResult.data && roomResult.data.clientId) {
						// Get client data
						const clientResult = await client.models.Client.get({
							id: roomResult.data.clientId,
						})
						if (clientResult.data) {
							console.log('Client result:', clientResult.data)
							// Build images array
							const images = []
							if (clientResult.data.fullBodyImage) {
								images.push({
									id: '1',
									url: clientResult.data.fullBodyImage,
									type: 'Full body',
								})
							}
							if (clientResult.data.halfBodyImage) {
								images.push({
									id: '2',
									url: clientResult.data.halfBodyImage,
									type: 'Half body',
								})
							}
							setClientImages(images)
						}
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
				const formattedMessages =
					room.data?.messages?.map((msg) => ({
						id: msg.id,
						text: msg.text || undefined,
						imageId: msg.imageId || undefined,
						sender: msg.userId || 'unknown',
						timestamp: msg.createdAt,
						createdAt: msg.createdAt,
					})) || []

				// Log initial message state for debugging
				console.log('Initial messages before sorting:', formattedMessages)

				// Sort messages by createdAt timestamp
				const sorted = sortMessages(formattedMessages)
				console.log('Sorted messages:', sorted)

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
				const newMsg: Message = {
					id: data.id,
					text: data.text || undefined,
					imageId: data.imageId || undefined,
					sender: data.userId || 'unknown',
					timestamp: data.createdAt,
					createdAt: data.createdAt,
				}
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
			userId: userId,
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
			const uploadResult = await uploadData({
				path: path,
				data: imageFile,
			})

			// Validate upload success
			if (!uploadResult) {
				throw new Error('Upload failed - no result returned')
			}

			console.log('File uploaded successfully:', path)

			// After successful upload, create a message in the database
			const messageResult = await client.models.Message.create({
				imageId: path,
				roomId: roomId,
				userId: userId,
				text: 'Image attachment',
			})

			console.log('Image message created:', messageResult)
			// We don't need to manually add the message here as it will come through the subscription
			// which now properly sorts messages by createdAt
		} catch (error) {
			console.error('Error uploading image or creating message:', error)
			throw error
		}
	}

	const handleOutfitGenerated = async (
		outfitCompositionURLs: Record<string, string>
	) => {
		if (!roomId) return

		const result = await client.mutations.generateFashionImage({
			baseImageUrl: outfitCompositionURLs.base,
			garmentImageUrl: outfitCompositionURLs.garment,
		})
		console.log('Starting outfit generation:', result)
		setGeneratedOutfit(result.data?.success ? 'success' : 'failure')
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
			<div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] bg-base-100 relative">
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

						<CreateOutfit
							userImages={clientImages}
							onOutfitGenerated={handleOutfitGenerated}
							generatedOutfit={generatedOutfit}
						/>
					</div>
				)}

				{/* Chat area */}
				<ChatWindow
					messages={messages}
					newMessage={newMessage}
					setNewMessage={setNewMessage}
					handleSendMessage={handleSendMessage}
					handleSendImage={handleSendImage}
					currentUser={{
						id: userId,
						name: 'You',
					}}
					stylist={MOCK_STYLIST}
				/>
			</div>
		</Authenticator>
	)
}

export default Chat
