import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import Home from './pages/Home.tsx'
import ThankYou from './pages/ThankYou.tsx'
import Chat from './pages/Chat.tsx'
import Profile from './pages/Profile.tsx'
import Navbar from './components/Navbar.tsx'
import Footer from './components/Footer.tsx'
import { Authenticator } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify'
import config from '../amplify_outputs.json'
import Rooms from './pages/Rooms.tsx'
import CatalogNew from './pages/CatalogNew.tsx'
import Catalog from './pages/Catalog.tsx'
Amplify.configure(config)

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Authenticator.Provider>
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/thank-you" element={<ThankYou />} />
					<Route path="/rooms" element={<Rooms />}>
						<Route path="/rooms/:roomId" element={<Chat />} />
					</Route>
					<Route path="/catalog" element={<Catalog />}></Route>
					<Route path="/catalog/new" element={<CatalogNew />} />
				</Routes>
				<Footer />
			</Authenticator.Provider>
		</BrowserRouter>
	</StrictMode>
)
