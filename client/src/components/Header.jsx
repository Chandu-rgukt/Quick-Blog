import React from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext.jsx'
import { useRef } from 'react'


function Header() {

  const { setInput,input } = useAppContext();
  const inputRef = useRef();

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setInput(inputRef.current.value);
  };

  const handleClearSearch = () => {
    setInput("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className='mx-8 sm:mx-24 xl:mx-24 relative'>
        <div className='text-center mt-20 mb-8'>
            <div className='inline-flex items-center justify-center gap-4 px-6 py-1.5
            mb-4 border border-primary/40 bg-primary/10 rounded-full text-sm text-primary'>
                <p>New: AI feature intigrated</p>
                <img src={assets.star_icon} alt="star_icon" className='absolute -top-50 -z-10 opacity-50' />
            </div>
            <h1 className='text-3xl sm:text-6xl font-semibold sm:leading-16 text-grey-700'>Your own <span className='text-primary'>blogging</span><br /> platform</h1>
            <p className='my-6 sm:my-8 max-w-2xl m-auto
            max-sum:text-xs text-grey-500'>This is a platform where you can share your thoughts and ideas with the world </p>
            <form onSubmit={onSubmitHandler} className='flex justify-between max-w-lg mx-sm:scale-75 mx-auto'>
              <input ref={inputRef} type="text" placeholder='Search for blogs' required
              className='w-full pl-4 outline-none'/>
              <button type="submit" className='bg-primary text-white px-8 py-2 m-1.5 rounded hover:scale-105 transition-all cursor-ponter'>Search</button>
            </form>
        </div>
        <div className='text-center'>
          {input && (
            <>
              <p className='text-sm text-grey-500'>Searching for: {input}</p>
              <button
                className='border font-light text-xs py-1 px-3 rounded-sm
                shadow-custom-sm cursor-pointer'
                onClick={handleClearSearch}
              >
                Clear Search
              </button>
            </>
          )}


        </div>
      </div>
      <img src={assets.gradientBackground} alt="gradient background" className='absolute -top-50 -z-10 opacity-50' />
    </div>
  )
}

export default Header
