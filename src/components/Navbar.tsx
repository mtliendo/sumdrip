import { Link } from 'react-router'
import ThemeController from './ThemeController'

function Navbar() {
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
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/describe-self">Style Profile</Link>
						</li>
						<li>
							<Link to="/chat">Chat</Link>
						</li>
					</ul>
				</div>
				<Link to="/" className="btn btn-ghost text-xl font-bold">
					SumDrip
				</Link>
			</div>

			<div className="navbar-center hidden md:flex">
				<ul className="menu menu-horizontal px-1">
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/describe-self">Style Profile</Link>
					</li>
					<li>
						<Link to="/chat">Chat</Link>
					</li>
				</ul>
			</div>

			<div className="navbar-end">
				<div className="flex flex-row gap-2">
					<Link
						to="/describe-self"
						className="btn btn-primary btn-sm md:btn-md"
					>
						Get Started
					</Link>
					<ThemeController />
				</div>
			</div>
		</div>
	)
}

export default Navbar
