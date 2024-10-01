import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Button } from "@nextui-org/react";
import { Element3, LocationTick } from "iconsax-react";
export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  return (
    <header>

<div className="absolute z-10 mt-3 right-6 w-[94%] mx-auto flex gap-5 justify-between items-center px-3 bg-white rounded-2xl shadow-sm max-md:flex-wrap max-md:justify-start">
      <div className="flex gap-2 self-stretch my-auto text-xl font-semibold leading-7 text-center text-gray-800">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/0113701fee1c73c34af3f762bc848105337bfa9d3bdbba40e192d45ed35dbc6b?apiKey=b22f6bf7f4034411b849e40a81909ff7&"
          alt="4G Hardware Icon"
          className="shrink-0 w-8 aspect-square"
        />
        <Link className="flex-auto my-auto" to='/'>    M2M SIMs </Link>
      </div>

      {/* <ul className='flex gap-4'>
          <Link to='/Map'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>
              Map
            </li>
          </Link>
          <Link to='/'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>
              Home
            </li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>
              About
            </li>
          </Link>
          <Link to='/messages'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>
              Messages
            </li>
          </Link>
          <Link to='/profile'>
            {currentUser ? (
              <img
                className='rounded-full h-7 w-7 object-cover'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <li className=' text-slate-700 hover:underline'> Sign in</li>
            )}
          </Link>
        </ul> */}
        <form
          onSubmit={handleSubmit}
          className='bg-slate-100 m-2 rounded-lg flex items-center'
        >
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent focus:outline-none w-24 sm:w-64'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className='text-slate-600' />
          </button>
        </form>
      <div className="justify-center self-stretch px-4 py-2.5 my-auto text-sm font-bold leading-5 text-blue-600 bg-sky-100 rounded-xl">
        Real Estate JORDAN
      </div>
    </div>
    </header>
  );
}
