import Image from "next/image";
import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  FiMail,
  FiMapPin,
  FiUsers,
  FiClock,
} from "react-icons/fi";
import { BookinCancel } from "@/component/BookinCancel";

const MyBookings = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  // 🚨 login check
  // if (!user) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <p className="text-red-500 text-xl font-semibold">
  //         Please login first
  //       </p>
  //     </div>
  //   );
  // }

  // 🚨 fetch bookings
  const res = await fetch(
    `http://localhost:5000/bookings/${user?.id}`
    // {
    //   cache: "no-store",
    //   headers: {
    //     authorization: "logged in",
    //   },
    // }
  );
const bookings = await res.json()
  // safety check (important)
  // let data = [];

  // try {
  //   data = await res.json();
  // } catch (err) {
  //   data = [];
  // }

  // নিশ্চিত করা এটা array
  // const bookings = Array.isArray(data) ? data : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 py-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-10">

        {/* LEFT SIDE */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-8">
            My Bookings
          </h1>

          {bookings.length === 0 ? (
            <p className="text-slate-500">No bookings found</p>
          ) : (
            <div className="space-y-6">

              {bookings.map((b, i) => (
                <div
                  key={b._id || i}
                  className="flex flex-col md:flex-row bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-lg"
                >

                  {/* IMAGE */}
                  <div className="relative w-full md:w-64 h-56">
                    <Image
                      src={
                        b.image ||
                        "https://placehold.co/600x400?text=No+Image"
                      }
                      alt={b.roomName || "Room"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 flex-1 space-y-3">
                    <h2 className="text-2xl font-bold">
                      {b.roomName}
                    </h2>

                    <p className="text-sm text-slate-500">
                      {b.description?.slice(0, 120)}
                    </p>

                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <FiMapPin />
                        {b.floor}
                      </div>

                      <div className="flex items-center gap-1">
                        <FiUsers />
                        {b.capacity}
                      </div>

                      <div className="flex items-center gap-1">
                        <FiClock />
                        ${b.hourlyRate}/hr
                      </div>
                    </div>

                    <BookinCancel bookingsId={b._id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-80">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-lg">

            <img
              src={user.image}
              className="w-24 h-24 rounded-full mx-auto"
            />

            <h2 className="text-center mt-4 font-bold">
              {user.name}
            </h2>

            <p className="text-center text-sm text-slate-500 flex justify-center gap-2 mt-2">
              <FiMail /> {user.email}
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Total</span>
                <b>{bookings.length}</b>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default MyBookings;