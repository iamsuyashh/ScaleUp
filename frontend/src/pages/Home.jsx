import React from 'react'
import Navbar from '../components/NavigationBar'
import HeroSection from '../components/heroSection'
import FileUploadComponent from '../components/upload'

const Home = () => {
  const isAuthenticated = false; 
  return (
    <div>
           <Navbar />
    <HeroSection/>
    <FileUploadComponent isAuthenticated={isAuthenticated} />
    </div>
  )
}

export default Home