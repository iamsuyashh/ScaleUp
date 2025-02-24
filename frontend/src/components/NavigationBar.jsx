import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-700">My App</h1>
      <div className="flex space-x-4">
        <Link to="/" className="text-gray-600 hover:text-blue-500">
          Home
        </Link>

        <Link to="/Dashboard" className="text-gray-600 hover:text-blue-500">
          Dashboard
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
