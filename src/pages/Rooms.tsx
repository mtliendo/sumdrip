import { useEffect, useState } from 'react'
import { Authenticator } from '@aws-amplify/ui-react'
import { generateClient } from 'aws-amplify/api'
import { Schema } from '../../amplify/data/resource'
import { fetchAuthSession } from 'aws-amplify/auth'
import { Link, Outlet, useParams, Navigate } from 'react-router'

const client = generateClient<Schema>()

type Room = {
	id: string
	clientId: string | null
	createdAt: string
	updatedAt: string
	clientName?: string
}

function Rooms() {
	const [rooms, setRooms] = useState<Room[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isStylist, setIsStylist] = useState(false)
	const { roomId } = useParams<{ roomId: string }>()

	// Check if user is stylist
	useEffect(() => {
		async function checkUserRole() {
			try {
				const session = await fetchAuthSession()
				const groups =
					(session.tokens?.idToken?.payload['cognito:groups'] as string[]) || []
				const isStylistUser = groups.includes('stylist')
				setIsStylist(isStylistUser)

				if (!isStylistUser) {
					// If not stylist and no roomId is provided, navigate to /profile
					if (!roomId) {
						// We'll redirect in the render method
					}
				}
			} catch (error) {
				console.error('Error checking user role:', error)
			} finally {
				setIsLoading(false)
			}
		}

		checkUserRole()
	}, [roomId])

	// Fetch rooms if stylist
	useEffect(() => {
		async function fetchRooms() {
			if (!isStylist) return

			try {
				const roomsResult = await client.models.Room.list()

				if (roomsResult.data) {
					// Sort rooms by createdAt (newest first)
					const sortedRooms = [...roomsResult.data].sort(
						(a, b) =>
							new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					)

					// Fetch client names for each room
					const roomsWithClientNames = await Promise.all(
						sortedRooms.map(async (room) => {
							if (!room.clientId) {
								return {
									id: room.id,
									clientId: room.clientId,
									createdAt: room.createdAt,
									updatedAt: room.updatedAt,
									clientName: 'Unknown Client',
								} as Room
							}

							try {
								const clientResult = await client.models.Client.get({
									id: room.clientId,
								})

								return {
									id: room.id,
									clientId: room.clientId,
									createdAt: room.createdAt,
									updatedAt: room.updatedAt,
									clientName: clientResult.data?.name || 'Unknown Client',
								} as Room
							} catch (error) {
								console.error(
									`Error fetching client for room ${room.id}:`,
									error
								)
								return {
									id: room.id,
									clientId: room.clientId,
									createdAt: room.createdAt,
									updatedAt: room.updatedAt,
									clientName: 'Unknown Client',
								} as Room
							}
						})
					)

					setRooms(roomsWithClientNames)
				}
			} catch (error) {
				console.error('Error fetching rooms:', error)
			}
		}

		fetchRooms()
	}, [isStylist])

	if (isLoading) {
		return (
			<Authenticator className="h-screen">
				<div className="flex justify-center items-center h-screen">
					<div className="loading loading-spinner loading-lg"></div>
				</div>
			</Authenticator>
		)
	}

	// If not stylist and no roomId, redirect to profile
	if (!isStylist && !roomId) {
		return <Navigate to="/profile" />
	}

	// If has roomId, show the chat component via outlet
	if (roomId) {
		return <Outlet />
	}

	return (
		<Authenticator className="h-screen">
			<div className="p-4">
				<h1 className="text-2xl font-bold mb-6">Client Rooms</h1>

				{rooms.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-lg">No client rooms found.</p>
					</div>
				) : (
					<div className="overflow-x-auto h-screen">
						<table className="table w-full">
							<thead>
								<tr>
									<th>Client</th>
									<th>Created</th>
									<th>Last Update</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{rooms.map((room) => (
									<tr key={room.id} className="hover">
										<td>{room.clientName || 'Unknown'}</td>
										<td>{new Date(room.createdAt).toLocaleString()}</td>
										<td>{new Date(room.updatedAt).toLocaleString()}</td>
										<td>
											<Link
												to={`/rooms/${room.id}`}
												className="btn btn-primary btn-sm"
											>
												View Chat
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</Authenticator>
	)
}

export default Rooms
