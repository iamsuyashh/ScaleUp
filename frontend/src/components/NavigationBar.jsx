import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="p-4 flex justify-between items-center px-6 transition-all duration-300">
      <h1 className="text-2xl font-bold text-gray-700 flex items-center">
        <img className="h-15 w-15 transition-transform duration-300 hover:scale-110" src="/logo.png" alt="Logo" />
      </h1>

      <div className="flex space-x-6 items-center">
        {/* Show Home & Dashboard only when signed in */}
        <SignedIn>
          <Link to="/" className="relative text-gray-600 hover:text-blue-500 transition-all after:absolute after:content-[''] after:w-full after:h-0.5 after:bg-blue-500 after:bottom-0 after:left-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">
            Home
          </Link>
          <Link to="/dashboard" className="relative text-gray-600 hover:text-blue-500 transition-all after:absolute after:content-[''] after:w-full after:h-0.5 after:bg-blue-500 after:bottom-0 after:left-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">
            Dashboard
          </Link>
          <UserButton />
        </SignedIn>

        {/* Show Sign-In button only when signed out */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:scale-105 hover:shadow-lg">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navbar;
