import { useRef, useEffect } from 'react'

interface Message {
	id: string
	sender: string
	text?: string
	image?: string
	timestamp: string
}

interface User {
	id: string
	name: string
}

interface ChatWindowProps {
	messages: Message[]
	newMessage: string
	setNewMessage: (message: string) => void
	handleSendMessage: (e: React.FormEvent) => void
	currentUser: User
	stylist: {
		id: string
		name: string
		avatar: string
	}
}

function ChatWindow({
	messages,
	newMessage,
	setNewMessage,
	handleSendMessage,
	currentUser,
	stylist,
}: ChatWindowProps) {
	const messageEndRef = useRef<HTMLDivElement>(null)

	// Auto scroll to bottom on new messages
	useEffect(() => {
		messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	const formatTime = (timestamp: string) => {
		const date = new Date(timestamp)
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
	}

	return (
		<div className="flex-grow flex flex-col">
			<div className="p-4 border-b border-base-300 flex items-center">
				<div className="avatar">
					<div className="w-10 rounded-full">
						<img src={stylist.avatar} alt="Stylist" />
					</div>
				</div>
				<div className="ml-3">
					<h2 className="font-bold">{stylist.name}</h2>
					<p className="text-xs">Your Personal Wardrobe Specialist</p>
				</div>
			</div>

			<div className="flex-grow overflow-y-auto p-4">
				<div className="flex flex-col gap-4">
					{messages.map((message) => (
						<div
							key={message.id}
							className={`chat ${
								message.sender === currentUser.id ? 'chat-end' : 'chat-start'
							}`}
						>
							{message.sender !== currentUser.id && (
								<div className="chat-image avatar">
									<div className="w-10 rounded-full">
										<img src={stylist.avatar} alt="Stylist avatar" />
									</div>
								</div>
							)}
							<div className="chat-header">
								{message.sender === currentUser.id ? 'You' : stylist.name}
								<time className="text-xs opacity-50 ml-1">
									{formatTime(message.timestamp)}
								</time>
							</div>
							<div
								className={`chat-bubble ${
									message.sender === currentUser.id ? 'chat-bubble-primary' : ''
								}`}
							>
								{message.text}
								{message.image && (
									<div className="mt-2">
										<img
											src={message.image}
											alt="Shared image"
											className="rounded-md max-w-full md:max-w-xs max-h-60 object-contain"
										/>
									</div>
								)}
							</div>
						</div>
					))}
					<div ref={messageEndRef} />
				</div>
			</div>

			<form
				onSubmit={handleSendMessage}
				className="p-4 border-t border-base-300 flex gap-2"
			>
				<input
					type="text"
					className="input input-bordered flex-grow"
					placeholder="Type a message..."
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
				/>
				<button
					type="submit"
					className="btn btn-primary"
					disabled={newMessage.trim() === ''}
				>
					Send
				</button>
			</form>
		</div>
	)
}

export default ChatWindow
