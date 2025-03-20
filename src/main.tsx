import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import Home from './pages/Home.tsx'
import DescribeSelf from './pages/DescribeSelf.tsx'
import ProfilePics from './pages/ProfilePics.tsx'
import ThankYou from './pages/ThankYou.tsx'
import Chat from './pages/Chat.tsx'
import Navbar from './components/Navbar.tsx'
import Footer from './components/Footer.tsx'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/describe-self" element={<DescribeSelf />} />
				<Route path="/profile-pics" element={<ProfilePics />} />
				<Route path="/thank-you" element={<ThankYou />} />
				<Route path="/chat" element={<Chat />} />
			</Routes>
			<Footer />
		</BrowserRouter>
	</StrictMode>
)
