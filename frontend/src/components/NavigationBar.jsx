import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center px-6">
      <h1 className="text-2xl font-bold text-gray-700">ScaleUp</h1>

      <div className="flex space-x-6 items-center">
        {/* Show Home & Dashboard only when signed in */}
        <SignedIn>
          <Link to="/" className="text-gray-600 hover:text-blue-500 transition">
            Home
          </Link>
          <Link to="/dashboard" className="text-gray-600 hover:text-blue-500 transition">
            Dashboard
          </Link>
          <UserButton />
        </SignedIn>

        {/* Show Sign-In button only when signed out */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navbar;
