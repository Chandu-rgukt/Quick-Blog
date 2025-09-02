import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import BlogList from '../components/BlogList'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'
import { assets } from '../assets/assets'

const Home = () => {
  return (
    <div>
      <img src={assets.gradientBackground} alt='' className='absolute -top-50 -z-1 opacity-50'/>
      <div>
       <Navbar/>
       <Header/>
       <BlogList/>
       <Newsletter/>
       <Footer/>
      </div>
       
    </div>
  )
}

export default Home
