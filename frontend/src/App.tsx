import { Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import RequireAuth from './components/RequireAuth.tsx';
import RedirectIfAuth from './components/RedirectIfAuth.tsx';
import RedirectIfInvalid from './components/RedirectIfInvalid.tsx';

import Homepage from './pages/Homepage.tsx';
import SignIn from './pages/SignIn.tsx';
import SignUp from './pages/SignUp.tsx';
import NewArticle from './pages/NewArticle.tsx';
import Settings from './pages/Settings.tsx';
import Profile from './pages/Profile.tsx';
import PublicProfile from './pages/PublicProfile.tsx';
import ArticlePage from './pages/ArticlePage.tsx';


export default function App() {
	return (
		<>
			<Navbar />
			<Routes>
				<Route path='/' element={<Homepage />}/>
				<Route path='/login' element={
					<RedirectIfAuth>
						<SignIn />
					</RedirectIfAuth>
				}/>
				<Route path='/register' element={
					<RedirectIfAuth>
						<SignUp />
					</RedirectIfAuth>
				}/>

				<Route path='/editor' element={
					<RequireAuth>
						<NewArticle />
					</RequireAuth>
				}/>

				<Route path='/settings' element={
					<RequireAuth>
						<Settings />
					</RequireAuth>
				}/>

				<Route path='/my-profile' element={
					<RequireAuth>
						<Profile />
					</RequireAuth>
				}/>

				<Route path='/profile/:username' element={
					<RequireAuth>
						<PublicProfile />
					</RequireAuth>
				}/>

				<Route path='/article/:username/:slug' element={
					<RequireAuth>
						<ArticlePage />
					</RequireAuth>
				}/>

				<Route path='*' element={
					<RedirectIfInvalid />
				}/>

			</Routes>
			<Footer />
		</>
		
	)
}