import React from 'react';

const Navbar = () => {
  return (
    <nav className="w-full p-4 bg-white shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-black rounded-full"></div>
        <span className="font-semibold text-gray-800">NameofProject</span>
      </div>
    </nav>
  );
};

export default Navbar;