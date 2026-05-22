"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, Button } from "@heroui/react";
import Link from "next/link";
import { FiBookOpen } from "react-icons/fi";
import { useState } from "react";

const Navbar = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [open, setOpen] = useState(false);

  const handelSignOut = async () => {
    await authClient.signOut();
  };

  return (
    <div className="border-b px-2 bg-white dark:bg-zinc-950">
      <nav className="flex justify-between items-center py-3 max-w-7xl mx-auto w-full">

        {/* Logo */}
        <div className="flex gap-2 items-center">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400"
          >
            <FiBookOpen className="h-6 w-6" />
            StudyNook
          </Link>
        </div>

        {/* Nav Links */}
        <ul className="flex items-center gap-5 text-sm">
          <li>
            <Link
              href="/"
              className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              href="/room"
              className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Room
            </Link>
          </li>

          {user && (
            <>
              <li>
                <Link
                  href="/addrooms"
                  className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Add-Room
                </Link>
              </li>

              <li>
                <Link
                  href="/my-listing"
                  className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  My Listings
                </Link>
              </li>

              <li>
                <Link
                  href="/mybookings"
                  className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  My Bookings
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Auth Buttons / User */}
        <div className="flex items-center gap-4 relative">

          {!user ? (
            <ul className="flex items-center gap-4 text-sm">
              <li>
                <Link
                  href="/login"
                  className="px-4 py-2 font-medium hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                >
                  SignIn
                </Link>
              </li>

              <li>
                <Link
                  href="/register"
                  className="px-4 py-2 font-medium bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-md transition-colors"
                >
                  Register
                </Link>
              </li>
            </ul>
          ) : (
            <div className="relative">

              {/* Profile Button */}
              <button onClick={() => setOpen(!open)} className="flex items-center gap-2">
                <Avatar>
                  <Avatar.Image src={user?.image} />
                  <Avatar.Fallback>{user?.name?.charAt(0)}</Avatar.Fallback>
                </Avatar>
              

                <p className="text-sm font-medium hidden md:block">
                  {user?.name}
                </p>
              </button>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 top-14 w-56 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl z-50 overflow-hidden">

                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800">
                    <p className="text-sm font-semibold">
                      {user?.name}
                    </p>

                    <p className="text-xs text-slate-500 truncate">
                      {user?.email}
                    </p>
                  </div>

                  {/* Dropdown Links */}
                  <div className="flex flex-col text-sm">

                    <Link
                      href="/addrooms"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Add Room
                    </Link>

                    <Link
                      href="/my-listing"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      My Listings
                    </Link>

                    <Link
                      href="/mybookings"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      My Bookings
                    </Link>

                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-200 dark:border-zinc-800 p-2">
                    <Button
                      onClick={handelSignOut}
                      color="danger"
                      variant="light"
                      className="w-full"
                    >
                      Logout
                    </Button>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      </nav>
    </div>
  );
};

export default Navbar;