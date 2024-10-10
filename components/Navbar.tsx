// components/Navbar.tsx
import Link from "next/link";
import MiniNavbar from "./MiniNavbar";
import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Ensure the correct path
import SearchBar from './SearchBar'; // Import the new SearchBar component

// Dark theme color variables
const bgNavbar = "bg-gray-900";
const shadowNavbar = "shadow-lg";
const textNavLink = "text-gray-300";
const hoverTextNavLink = "hover:text-blue-400";
const hoverTextButton = "hover:text-blue-400";
const dropdownBg = "bg-gray-800";
const dropdownBorder = "border-gray-700";
const dropdownText = "text-gray-300";
const dropdownHoverBg = "hover:bg-gray-700";
const signInBg = "bg-blue-600";
const signInText = "text-white";
const hoverSignInBg = "hover:bg-blue-500";

export default function Navbar() {
  const { isAuthenticated, fullName, logout } = useAuth();

  // State to control dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      {/* Navbar section */}
      <nav className={`${bgNavbar} ${shadowNavbar} fixed w-full top-0 z-50 h-24`}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo Section */}
            <div className="flex items-center h-full">
              <Link href="/">
                <img
                  src="/images/anilelectronics.jpg"
                  alt="Logo"
                  className="h-16 w-32"  
                />
              </Link>
            </div>

            {/* Search Bar */}
            <SearchBar /> {/* Search bar moved into its own component */}

            {/* Nav Links */}
            <div className="hidden md:flex space-x-6 items-center h-full">
              <Link className={`${textNavLink} ${hoverTextNavLink} transition-colors duration-300 m-auto flex items-center h-full`} href="/products">
                Products
              </Link>
              <Link className={`${textNavLink} ${hoverTextNavLink} transition-colors duration-300 m-auto flex items-center h-full`} href="/about">
                About
              </Link>

              {isAuthenticated ? (
                <div className="relative h-full flex items-center" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                  <button className={`${textNavLink} ${hoverTextButton} transition-colors duration-300 m-auto flex items-center h-full`}>
                    Hi, {fullName || 'User'}
                  </button>
                  {dropdownOpen && (
                    <div className={`absolute right-0 w-48 ${dropdownBg} ${dropdownBorder} rounded-md shadow-lg z-10`}>
                      <Link href="/profile" className={`block px-4 py-2 ${dropdownText} ${dropdownHoverBg}`}>Profile</Link>
                      <Link href="/orders" className={`block px-4 py-2 ${dropdownText} ${dropdownHoverBg}`}>My Orders</Link>
                      <button 
                        className={`w-full text-left block px-4 py-2 ${dropdownText} ${dropdownHoverBg}`}
                        onClick={logout}
                      >
                        Sign Out
                      </button>
                      <Link href="/cart" className={`block px-4 py-2 ${dropdownText} ${dropdownHoverBg}`}>Cart</Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link className={`${signInBg} ${signInText} px-4 py-2 rounded-lg ${hoverSignInBg} transition-transform duration-300 transform hover:scale-105 m-auto flex items-center h-3/5`} href="/login">
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button type="button" className="text-gray-400 hover:text-gray-200 focus:outline-none">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MiniNavbar should appear below the main Navbar */}
      <div className="pt-24">
        <MiniNavbar />
      </div>
    </>
  );
}
