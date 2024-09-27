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

      <div className="flex gap-4 items-center self-stretch text-xs font-bold leading-5 max-md:flex-wrap">
        <div className="flex gap-3 justify-center self-stretch p-1 bg-white rounded-xl">
          <div className="flex gap-1 justify-center my-auto whitespace-nowrap text-zinc-950">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/422fd0a550aba2126c4e03b0e92593b1cb5c6ce4f0720f1dc02a098e382a628d?apiKey=b22f6bf7f4034411b849e40a81909ff7&"
              alt="Layers Icon"
              className="shrink-0 w-5 aspect-square"
            />
            <div>Layers</div>
          </div>
          <div className="flex flex-auto gap-1 justify-center p-1 text-white rounded-xl">
            
          </div>
        </div>
        <div className="shrink-0 self-stretch my-auto w-px h-8 border border-solid bg-neutral-900 bg-opacity-10 border-neutral-900 border-opacity-10" />
        <div className="flex gap-1 justify-center self-stretch p-1 my-auto text-white whitespace-nowrap rounded-xl">
          <Button
            className="h-[32px] mt-[1px] rounded-lg"
            color={true ? "primary" : "default"}
    
          >
            <LocationTick
              size={18}
              variant="Bulk"
              color={true ? "#fff" : "#040506"}
            />
            <label className="text-[12px]">Legend</label>
          </Button>
          <Button
            className="h-[32px] mt-[1px] rounded-lg"
            color={true ? "primary" : "default"}
         
          >
            <Element3
              size={18}
              variant="Bulk"
              color={true ? "#fff" : "#040506"}
            />
            <label className="text-[12px]">Widgets</label>
          </Button>
        </div>
      </div>
      <ul className='flex gap-4'>
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
        </ul>
        <form
          onSubmit={handleSubmit}
          className='bg-slate-100 p-3 rounded-lg flex items-center'
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
