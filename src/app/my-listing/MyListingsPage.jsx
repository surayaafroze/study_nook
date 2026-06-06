'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { FiEdit2, FiTrash2, FiMapPin, FiUsers, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';


// export const metadata = {
//   title: "My Listing | studyNook",
//   description: "View and manage all your listed study rooms in one place.",
// };

const AmenityChips = ({ amenities }) => {
  const safe = Array.isArray(amenities) ? amenities : [];
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {safe.slice(0, 3).map((item, i) => (
        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
          {item}
        </span>
      ))}
      {safe.length > 3 && (
        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
          +{safe.length - 3} more
        </span>
      )}
    </div>
  );
};

export default function MyListingsPage() {
  const { data: session } = authClient.useSession();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jwtToken, setJwtToken] = useState(null);

  // ✅ Step 1: JWT token নিন
  useEffect(() => {
    if (!session) return;

    const fetchJwt = async () => {
      try {
        const res = await fetch('/api/auth/token', {
          credentials: 'include',
        });
        const data = await res.json();
        console.log('JWT token:', data.token); // verify করুন
        setJwtToken(data.token);
      } catch (err) {
        console.error('Failed to get JWT:', err);
      }
    };

    fetchJwt();
  }, [session]);

  // ✅ Step 2: JWT দিয়ে rooms fetch করুন
  useEffect(() => {
    if (!jwtToken) return;

    const fetchRooms = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-rooms`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Failed');
        setRooms(data?.data || []);
      } catch (err) {
        toast.error('Failed to load your listings');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [jwtToken]);

  const handleDelete = async (id) => {
    if (!jwtToken) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!res.ok) throw new Error();
      setRooms((prev) => prev.filter((r) => r._id !== id));
      toast.success('Room deleted successfully');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  // ... বাকি JSX same থাকবে
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            My Listings
          </h1>
          <p className="text-sm text-gray-500">
            Manage your created rooms
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center text-gray-500 py-10">
            Loading your rooms...
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && rooms.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            No rooms found. Create your first listing 🚀
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {rooms.map((room) => (
            <div
              key={room._id}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
            >

              {/* IMAGE */}
              <div className="h-40 bg-gray-200 dark:bg-zinc-800">
                {room.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={room.image}
                    alt={room.roomName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* CONTENT */}
              <div className="p-5">

                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {room.roomName}
                </h2>

                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {room.description}
                </p>

                {/* INFO */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">

                  <span className="flex items-center gap-1">
                    <FiMapPin /> {room.floor || 'N/A'}
                  </span>

                  <span className="flex items-center gap-1">
                    <FiUsers /> {room.capacity}
                  </span>

                  <span className="flex items-center gap-1">
                    <FiDollarSign /> {room.hourlyRate}
                  </span>

                </div>

                {/* AMENITIES */}
                <AmenityChips amenities={room.amenities} />

                {/* ACTIONS */}
                <div className="flex gap-2 mt-5">

                  {/* <button
                    onClick={() => alert('Edit coming soon')}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    <FiEdit2 size={14} />
                    Edit
                  </button> */}

                  <button
                    onClick={() => handleDelete(room._id)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    <FiTrash2 size={14} />
                    Delete
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}