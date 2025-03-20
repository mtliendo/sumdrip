import { Link } from 'react-router'

function ThankYou() {
	return (
		<div className="hero min-h-screen bg-base-200">
			<div className="hero-content text-center">
				<div className="max-w-md">
					<div className="mb-8">
						<div className="inline-block p-4 bg-success text-white rounded-full">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-24 w-24"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
					</div>
					<h1 className="text-5xl font-bold">Thank You!</h1>
					<p className="py-6 text-xl">
						Your style profile is complete. Our wardrobe specialist will review
						your information and reach out with personalized recommendations
						soon.
					</p>
					<p className="mb-8">
						You can chat with your wardrobe specialist anytime by clicking the
						button below.
					</p>
					<Link to="/chat" className="btn btn-primary btn-lg">
						View Chat
					</Link>
				</div>
			</div>
		</div>
	)
}

export default ThankYou
