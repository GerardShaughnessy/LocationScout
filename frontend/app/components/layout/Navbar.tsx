'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  if (!mounted) return null;

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">LocationScout</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/' ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-500'
              }`}
            >
              Home
            </Link>
            
            <Link 
              href="/locations" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/locations' || pathname.startsWith('/locations/') 
                  ? 'bg-indigo-700 text-white' 
                  : 'text-indigo-100 hover:bg-indigo-500'
              }`}
            >
              Locations
            </Link>
            
            {user ? (
              <>
                <Link 
                  href="/profile" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/profile' ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-500'
                  }`}
                >
                  Profile
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-indigo-100 hover:bg-indigo-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/login' ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-500'
                  }`}
                >
                  Login
                </Link>
                
                <Link 
                  href="/register" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/register' ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-500'
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-100 hover:bg-indigo-500 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon for close */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            href="/" 
            onClick={closeMenu}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname === '/' ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-500'
            }`}
          >
            Home
          </Link>
          
          <Link 
            href="/locations" 
            onClick={closeMenu}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname === '/locations' || pathname.startsWith('/locations/') 
                ? 'bg-indigo-700 text-white' 
                : 'text-indigo-100 hover:bg-indigo-500'
            }`}
          >
            Locations
          </Link>
          
          {user ? (
            <>
              <Link 
                href="/profile" 
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === '/profile' ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-500'
                }`}
              >
                Profile
              </Link>
              
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-indigo-100 hover:bg-indigo-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === '/login' ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-500'
                }`}
              >
                Login
              </Link>
              
              <Link 
                href="/register" 
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === '/register' ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-500'
                }`}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 