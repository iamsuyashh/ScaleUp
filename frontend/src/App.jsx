import React from 'react';
import Navbar from './components/NavigationBar';
import FileUploadComponent from './components/upload';

import HeroSection from './components/heroSection';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
     <HeroSection/>
     <FileUploadComponent/>
    </div>
  );
};

export default App;