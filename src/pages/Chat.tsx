import { useState } from 'react'
import ChatWindow from '../components/ChatWindow'
import CreateOutfit from '../components/CreateOutfit'

// Mock data for demonstration
const MOCK_USER = {
	id: '123',
	name: 'You',
	role: 'customer',
	images: [
		{
			id: '1',
			url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
			type: 'frontImage',
		},
		{
			id: '2',
			url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
			type: 'halfBodyImage',
		},
	],
}

const MOCK_STYLIST = {
	id: '456',
	name: 'Stylist Jamie',
	role: 'stylist',
	avatar:
		'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80',
}

const MOCK_INITIAL_MESSAGES = [
	{
		id: '1',
		sender: MOCK_STYLIST.id,
		text: "Hi there! I'm Jamie, your personal wardrobe specialist. I've reviewed your style profile and I'm excited to help you find outfits that suit your personality and body type.",
		timestamp: new Date(Date.now() - 3600000).toISOString(),
	},
	{
		id: '2',
		sender: MOCK_STYLIST.id,
		text: "Looking at your profile, I see you're interested in a mix of professional and casual styles. I'll be curating some outfit recommendations for you shortly.",
		timestamp: new Date(Date.now() - 3540000).toISOString(),
	},
	{
		id: '3',
		sender: MOCK_USER.id,
		text: "Thanks Jamie! I'm looking forward to your recommendations. I have an important work event coming up next month that I need an outfit for.",
		timestamp: new Date(Date.now() - 3480000).toISOString(),
	},
]

interface Message {
	id: string
	sender: string
	text?: string
	image?: string
	timestamp: string
}

function Chat() {
	const [messages, setMessages] = useState<Message[]>(MOCK_INITIAL_MESSAGES)
	const [newMessage, setNewMessage] = useState('')
	const [showSidebar, setShowSidebar] = useState(false)
	const isStylist = true // Toggle this to show/hide stylist features

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault()
		if (newMessage.trim() === '') return

		const newMsg: Message = {
			id: Date.now().toString(),
			sender: MOCK_USER.id,
			text: newMessage,
			timestamp: new Date().toISOString(),
		}

		setMessages([...messages, newMsg])
		setNewMessage('')

		// Mock stylist response after a delay
		setTimeout(() => {
			const stylistResponse: Message = {
				id: (Date.now() + 1).toString(),
				sender: MOCK_STYLIST.id,
				text: "Thanks for sharing that! I'll find the perfect outfit for your work event. Would you prefer something more formal or business casual?",
				timestamp: new Date().toISOString(),
			}
			setMessages((prev) => [...prev, stylistResponse])
		}, 1500)
	}

	const handleOutfitGenerated = (outfitImage: string) => {
		const outfitMsg: Message = {
			id: Date.now().toString(),
			sender: MOCK_STYLIST.id,
			image: outfitImage,
			text: "Here's an outfit I think would look great on you for that work event! It's professional but still shows your personality.",
			timestamp: new Date().toISOString(),
		}

		setMessages([...messages, outfitMsg])
	}

	return (
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
						userImages={MOCK_USER.images}
						onOutfitGenerated={handleOutfitGenerated}
					/>
				</div>
			)}

			{/* Chat area */}
			<ChatWindow
				messages={messages}
				newMessage={newMessage}
				setNewMessage={setNewMessage}
				handleSendMessage={handleSendMessage}
				currentUser={MOCK_USER}
				stylist={MOCK_STYLIST}
			/>
		</div>
	)
}

export default Chat
