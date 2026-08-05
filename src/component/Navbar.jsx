'use client';

import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import Image from 'next/image';
import { FiBookOpen, FiChevronDown, FiLogOut, FiPlusSquare, FiList, FiCalendar, FiMenu, FiX } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    setOpen(false);
    setMobileOpen(false);
    router.push('/register');
  };

  return (
    <div className="border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-40">
      <nav className="flex justify-between items-center py-3 px-4 max-w-7xl mx-auto w-full">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400 shrink-0"
        >
          <FiBookOpen className="h-6 w-6" />
          StudyNook
        </Link>

        {/* Nav Links (Desktop) */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
          <li>
            <Link
              href="/"
              className="text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/room"
              className="text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Rooms
            </Link>
          </li>

          {user && (
            <>
              <li>
                <Link
                  href="/addrooms"
                  className="text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Add Room
                </Link>
              </li>
              <li>
                <Link
                  href="/my-listing"
                  className="text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  My Listings
                </Link>
              </li>
              <li>
                <Link
                  href="/mybookings"
                  className="text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  My Bookings
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Auth Section & Mobile Toggle */}
        <div className="flex items-center gap-3">

          {!user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium px-4 py-2 rounded-lg text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>

              {/* Avatar Button */}
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center shrink-0">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || 'User'}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <span className="hidden md:block text-sm font-medium text-slate-700 dark:text-zinc-200 max-w-[120px] truncate">
                  {user?.name}
                </span>
                <FiChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl z-50 overflow-hidden">

                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-zinc-500 truncate mt-0.5">
                      {user?.email}
                    </p>
                  </div>

                  {/* Links */}
                  <div className="py-1">
                    <Link
                      href="/addrooms"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <FiPlusSquare size={15} className="text-indigo-500" />
                      Add Room
                    </Link>
                    <Link
                      href="/my-listing"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <FiList size={15} className="text-indigo-500" />
                      My Listings
                    </Link>
                    <Link
                      href="/mybookings"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <FiCalendar size={15} className="text-indigo-500" />
                      My Bookings
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-100 dark:border-zinc-800 p-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <FiLogOut size={15} />
                      Sign Out
                    </button>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 dark:text-zinc-200 hover:text-indigo-600"
          >
            Home
          </Link>
          <Link
            href="/room"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 dark:text-zinc-200 hover:text-indigo-600"
          >
            Rooms
          </Link>
          {user && (
            <>
              <Link
                href="/addrooms"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 dark:text-zinc-200 hover:text-indigo-600"
              >
                Add Room
              </Link>
              <Link
                href="/my-listing"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 dark:text-zinc-200 hover:text-indigo-600"
              >
                My Listings
              </Link>
              <Link
                href="/mybookings"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 dark:text-zinc-200 hover:text-indigo-600"
              >
                My Bookings
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;