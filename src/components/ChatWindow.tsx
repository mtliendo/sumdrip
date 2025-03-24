import { useRef, useEffect, useState, useMemo } from 'react'
import { StorageImage } from '@aws-amplify/ui-react-storage'

interface Message {
	id: string
	sender: string
	text?: string
	imageId?: string
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
	handleSendImage: (imageData: File) => void
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
	handleSendImage,
	currentUser,
	stylist,
}: ChatWindowProps) {
	const messageEndRef = useRef<HTMLDivElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [uploading, setUploading] = useState(false)

	// Sort messages by timestamp to ensure consistent order
	const sortedMessages = useMemo(() => {
		console.log('ChatWindow received messages:', messages)
		console.log('Current user ID:', currentUser.id)
		const sorted = [...messages].sort((a, b) => {
			// Ensure we have valid dates before comparison
			const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0
			const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0
			return timeA - timeB
		})
		console.log('ChatWindow sorted messages:', sorted)
		return sorted
	}, [messages, currentUser.id])

	// Auto scroll to bottom on new messages
	useEffect(() => {
		messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [sortedMessages])

	const formatTime = (timestamp: string) => {
		const date = new Date(timestamp)
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
	}

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setUploading(true)
			const file = e.target.files[0]
			try {
				await handleSendImage(file)
			} catch (error) {
				console.error('Error uploading file:', error)
			} finally {
				setUploading(false)
				// Reset file input
				if (fileInputRef.current) {
					fileInputRef.current.value = ''
				}
			}
		}
	}

	const handleSubmitForm = (e: React.FormEvent) => {
		e.preventDefault()
		if (newMessage.trim() !== '') {
			handleSendMessage(e)
		}
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
					{sortedMessages.map((message) => (
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
								{message.imageId && (
									<div className="mt-2">
										<StorageImage
											path={message.imageId}
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
				onSubmit={handleSubmitForm}
				className="p-4 border-t border-base-300 flex gap-2 flex-wrap items-center"
			>
				<input
					type="file"
					ref={fileInputRef}
					className="hidden"
					onChange={handleFileChange}
					accept="image/*"
				/>
				<button
					type="button"
					className="btn btn-circle btn-sm"
					onClick={() => fileInputRef.current?.click()}
					disabled={uploading}
				>
					{uploading ? (
						<div className="loading loading-spinner loading-xs"></div>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					)}
				</button>
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
					disabled={newMessage.trim() === '' || uploading}
				>
					Send
				</button>
			</form>
		</div>
	)
}

export default ChatWindow
