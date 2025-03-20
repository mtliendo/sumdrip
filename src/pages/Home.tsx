import { Link } from 'react-router'

function Home() {
	return (
		<div className="min-h-screen flex flex-col">
			{/* Hero Section */}
			<div className="hero min-h-[70vh] bg-gradient-to-r from-primary to-accent">
				<div className="hero-content flex-col lg:flex-row-reverse max-w-7xl">
					<img
						src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
						className="max-w-sm rounded-lg shadow-2xl"
						alt="Stylish outfit"
					/>
					<div className="text-white">
						<h1 className="text-5xl font-bold">
							Your Personal Style, Delivered
						</h1>
						<p className="py-6 text-xl">
							SumDrip connects you with professional wardrobe specialists who
							curate personalized outfits based on your unique style, body type,
							and preferences.
						</p>
						<Link
							to="/describe-self"
							className="btn btn-primary bg-base-100 text-primary-content"
						>
							Get Started
						</Link>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="py-16 px-4 max-w-7xl mx-auto">
				<h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Feature 1 */}
					<div className="card bg-base-100 shadow-xl">
						<figure className="px-10 pt-10">
							<div className="rounded-full bg-primary p-6 text-white">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-14 w-14"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
						</figure>
						<div className="card-body items-center text-center">
							<h3 className="card-title text-2xl">Create Your Profile</h3>
							<p>
								Tell us about your style preferences, body type, and share some
								photos
							</p>
						</div>
					</div>

					{/* Feature 2 */}
					<div className="card bg-base-100 shadow-xl">
						<figure className="px-10 pt-10">
							<div className="rounded-full bg-secondary p-6 text-white">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-14 w-14"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
									/>
								</svg>
							</div>
						</figure>
						<div className="card-body items-center text-center">
							<h3 className="card-title text-2xl">Chat with Specialists</h3>
							<p>
								Connect with expert wardrobe specialists who understand your
								unique style
							</p>
						</div>
					</div>

					{/* Feature 3 */}
					<div className="card bg-base-100 shadow-xl">
						<figure className="px-10 pt-10">
							<div className="rounded-full bg-accent p-6 text-white">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-14 w-14"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
									/>
								</svg>
							</div>
						</figure>
						<div className="card-body items-center text-center">
							<h3 className="card-title text-2xl">Receive Curated Styles</h3>
							<p>
								Get personalized outfit recommendations based on your
								preferences
							</p>
						</div>
					</div>
				</div>

				<div className="text-center mt-12">
					<Link to="/describe-self" className="btn btn-primary btn-lg">
						Start Your Style Journey
					</Link>
				</div>
			</div>
		</div>
	)
}

export default Home
