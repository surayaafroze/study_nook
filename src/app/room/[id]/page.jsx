import BookinButton from '@/component/BookinButton';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Image from 'next/image';
import React from 'react';

const RoomDetailsPage = async ({ params }) => {
  const { id } = await params;

   const {token}=await auth.api.getToken({
headers: await headers() 
});
console.log(token)
  const res = await fetch(`http://localhost:5000/room/${id}`,{
    headers: {
      authorization:`Bearer ${token}`||""
  }
}
  );

  // if (!res.ok) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <p className="text-red-500 text-xl font-semibold">
  //         Room not found or unauthorized.
  //       </p>
  //     </div>
  //   );
  // }

  const room = await res.json();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 py-10">
      <div className="max-w-6xl mx-auto px-4">

        {/* HERO IMAGE */}
        <div className="relative w-full h-[320px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src={room.image}
            alt={room.roomName}
            fill
            className="object-cover hover:scale-105 transition duration-500"
            priority
          />
        </div>

        {/* CONTENT CARD */}
        <div className="mt-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-slate-200 dark:border-zinc-800 p-6 md:p-10">

          {/* TITLE + PRICE */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
                {room.roomName}
              </h1>
              <p className="mt-2 text-slate-500 dark:text-zinc-400">
                📍 Floor: {room.floor}
              </p>
            </div>

            {/* PRICE CARD */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-5 rounded-2xl shadow-lg text-center">
              <p className="text-3xl font-bold">${room.hourlyRate}</p>
              <p className="text-sm opacity-80">per hour</p>
            </div>

          </div>

          {/* QUICK INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">

            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-zinc-800">
              <p className="text-sm text-slate-500">Capacity</p>
              <p className="text-xl font-bold">{room.capacity} People</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-zinc-800">
              <p className="text-sm text-slate-500">Floor</p>
              <p className="text-xl font-bold">{room.floor}</p>
            </div>

          </div>

          {/* DESCRIPTION */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
              About this space
            </h2>
            <p className="text-slate-600 dark:text-zinc-300 leading-7">
              {room.description}
            </p>
          </div>

          {/* AMENITIES */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
              Amenities
            </h2>
            <div className="flex flex-wrap gap-3">
              {room.amenities?.map((item, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 text-sm font-medium border border-indigo-100 dark:border-zinc-800"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* BOOK BUTTON */}
          <div className="mt-10">
            <BookinButton room={room} token={token} />
            <p className="text-center text-xs text-slate-400 mt-3">
              Instant confirmation • Free cancellation available
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;