import { Link } from 'react-router'
import ThemeController from './ThemeController'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { useEffect, useState } from 'react'
import { generateClient } from 'aws-amplify/api'
import { Schema } from '../../amplify/data/resource'
import { useUserGroup } from '../hooks/useUserGroup'

const client = generateClient<Schema>()

function Navbar() {
	const { user, signOut } = useAuthenticator((context) => [context.user])

	const [hasRoom, setHasRoom] = useState(false)
	const [roomId, setRoomId] = useState<string | null>(null)
	const { isInGroup: isStylist } = useUserGroup('stylist')

	useEffect(() => {
		async function checkClientRoom() {
			if (!user || isStylist) return

			try {
				const clientsResult = await client.models.Client.list()
				if (clientsResult.data && clientsResult.data.length > 0) {
					const clientId = clientsResult.data[0].id

					// Get rooms for this client
					const roomsResult = await client.models.Room.list({
						filter: { clientId: { eq: clientId } },
					})

					if (roomsResult.data && roomsResult.data.length > 0) {
						setHasRoom(true)
						setRoomId(roomsResult.data[0].id)
					} else {
						setHasRoom(false)
						setRoomId(null)
					}
				}
			} catch (error) {
				console.error('Error fetching client room:', error)
			}
		}

		checkClientRoom()
	}, [user, isStylist])

	const getChatLink = () => {
		if (isStylist) {
			return '/rooms'
		} else if (hasRoom && roomId) {
			return `/rooms/${roomId}`
		} else {
			return null
		}
	}

	const chatLink = getChatLink()

	return (
		<div className="navbar bg-base-100 shadow-sm w-full">
			<div className="navbar-start">
				<div className="dropdown">
					<div tabIndex={0} role="button" className="btn btn-ghost md:hidden">
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
								d="M4 6h16M4 12h8m-8 6h16"
							/>
						</svg>
					</div>
					<ul
						tabIndex={0}
						className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
					>
						<li>
							{isStylist ? (
								<Link to="/catalog">Catalog</Link>
							) : (
								<Link to="/profile">Profile</Link>
							)}
						</li>
						{chatLink && (
							<li>
								<Link to={chatLink}>{isStylist ? 'Rooms' : 'Chat'}</Link>
							</li>
						)}
					</ul>
				</div>
				<Link to="/" className="btn btn-ghost text-xl font-bold">
					SumDrip
				</Link>
			</div>

			<div className="navbar-center hidden md:flex">
				<ul className="menu menu-horizontal px-1">
					{chatLink && (
						<li>
							<Link to={chatLink}>{isStylist ? 'Rooms' : 'Chat'}</Link>
						</li>
					)}
				</ul>
			</div>

			<div className="navbar-end">
				<div className="flex flex-row gap-2">
					{isStylist ? (
						<Link to="/catalog" className="btn btn-ghost btn-sm md:btn-md">
							Catalog
						</Link>
					) : (
						<Link to="/profile" className="btn btn-ghost btn-sm md:btn-md">
							Profile
						</Link>
					)}
					{user ? (
						<button
							onClick={signOut}
							className="btn btn-primary btn-sm md:btn-md"
						>
							Sign Out
						</button>
					) : (
						<Link to="/profile" className="btn btn-primary btn-sm md:btn-md">
							Sign In
						</Link>
					)}
					<ThemeController />
				</div>
			</div>
		</div>
	)
}

export default Navbar
