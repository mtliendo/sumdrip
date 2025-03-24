import { useRef, useState, useMemo } from 'react'
import { StorageImage } from '@aws-amplify/ui-react-storage'
import { Schema } from '../../amplify/data/resource'

interface ChatWindowProps {
	messages: Schema['Message']['type'][]
	newMessage: string
	setNewMessage: (message: string) => void
	handleSendMessage: (e: React.FormEvent) => void
	handleSendImage: (imageData: File) => void
	isStylist: boolean
}

function ChatWindow({
	messages,
	newMessage,
	setNewMessage,
	handleSendMessage,
	handleSendImage,
	isStylist,
}: ChatWindowProps) {
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [uploading, setUploading] = useState(false)

	// Sort messages by timestamp to ensure consistent order
	const sortedMessages = useMemo(() => {
		const sorted = [...messages].sort((a, b) => {
			// Ensure we have valid dates before comparison
			const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
			const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
			return timeA - timeB
		})
		return sorted
	}, [messages])

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
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-y-auto p-4">
				<div className="flex flex-col gap-4">
					{sortedMessages.map((message) => {
						console.log('Message:', message)
						console.log(
							'chat-images/4030be61-c4c8-4c09-9a03-38bddccd0bb1/1742849146799-carpentry.png'
						)
						const isFromCurrentUser =
							(isStylist && message.userType === 'stylist') ||
							(!isStylist && message.userType === 'client')

						return (
							<div
								key={message.id}
								className={`chat ${isFromCurrentUser ? 'chat-end' : 'chat-start'}`}
							>
								{!isFromCurrentUser && (
									<div className="chat-image avatar">
										<div className="w-10 rounded-full">
											<img
												src="https://github.com/mtliendo.png"
												alt={`${message.userType} avatar`}
											/>
										</div>
									</div>
								)}
								<div className="chat-header">
									{isFromCurrentUser
										? 'You'
										: message.userType === 'stylist'
											? 'Stylist'
											: 'Client'}
									<time className="text-xs opacity-50 ml-1">
										{formatTime(message.createdAt)}
									</time>
								</div>
								<div
									className={`chat-bubble ${
										isFromCurrentUser ? 'chat-bubble-primary' : ''
									}`}
								>
									{message.text}
									{message.imageId && (
										<div className="mt-2">
											<StorageImage
												path={message.imageId}
												height={200}
												width={200}
												alt="Shared image"
												className="rounded-md max-w-full md:max-w-xs max-h-60 object-contain"
											/>
										</div>
									)}
								</div>
							</div>
						)
					})}
				</div>
			</div>

			<div className="bg-base-100 border-t border-base-300">
				<form
					onSubmit={handleSubmitForm}
					className="p-4 flex gap-2 flex-wrap items-center"
				>
					<input
						type="file"
						ref={fileInputRef}
						className="hidden"
						onChange={handleFileChange}
						accept="image/*"
						disabled={uploading}
					/>
					<button
						type="button"
						className={`btn btn-circle btn-sm ${uploading ? 'btn-disabled' : ''}`}
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
						disabled={uploading}
					/>
					<button
						type="submit"
						className={`btn btn-primary ${uploading ? 'btn-disabled' : ''}`}
						disabled={newMessage.trim() === '' || uploading}
					>
						Send
					</button>
				</form>
			</div>
		</div>
	)
}

export default ChatWindow
