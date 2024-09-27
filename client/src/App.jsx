import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';
import ImageSearch from './pages/ImageSearch';
import MessagesPage from './pages/MessagesPage';
import MapInit from './pages/MapInit';
import SideBar from './components/sidebar/Sidebar'
export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className=" absolute z-20 side-bar-z-index-custom">
      <SideBar />
        </div>

      <Routes>
        <Route path='/' element={<MapInit />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/messages' element={<MessagesPage />} />
        <Route path='/home' element={<Home />} />

        <Route path='/about' element={<About />} />
        <Route path='/search' element={<Search />} />
        <Route path='/image-search' element={<ImageSearch />} /> {/* New route */}
        <Route path='/listing/:listingId' element={<Listing />} />

        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route
            path='/update-listing/:listingId'
            element={<UpdateListing />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
