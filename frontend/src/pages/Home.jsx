import React from 'react'
import Navbar from '../components/NavigationBar'
import HeroSection from '../components/heroSection'
import FileUploadComponent from '../components/upload'

const Home = () => {
  return (
    <div>
           <Navbar />
    <HeroSection/>
    <FileUploadComponent/>
    </div>
  )
}

export default Home