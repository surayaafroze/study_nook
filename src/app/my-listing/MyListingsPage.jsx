'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';
import { FiTrash2, FiMapPin, FiUsers, FiDollarSign, FiAlertTriangle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AmenityChips = ({ amenities }) => {
  const safe = Array.isArray(amenities) ? amenities : [];
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {safe.slice(0, 3).map((item, i) => (
        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300">
          {item}
        </span>
      ))}
      {safe.length > 3 && (
        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400">
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
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Step 1: Fetch JWT token
  useEffect(() => {
    if (!session) return;

    const fetchJwt = async () => {
      try {
        const res = await fetch('/api/auth/token', {
          credentials: 'include',
        });
        const data = await res.json();
        setJwtToken(data.token);
      } catch (err) {
        console.error('Failed to get JWT:', err);
      }
    };

    fetchJwt();
  }, [session]);

  // Step 2: Fetch rooms with JWT
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

  const confirmDelete = async () => {
    if (!jwtToken || !deleteTarget) return;
    try {
      setDeleting(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room/${deleteTarget._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!res.ok) throw new Error();
      setRooms((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      toast.success('Room deleted successfully');
      setDeleteTarget(null);
    } catch (err) {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            My Listings
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Manage your created study rooms
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center text-gray-500 dark:text-zinc-400 py-10">
            Loading your rooms...
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && rooms.length === 0 && (
          <div className="text-center text-gray-500 dark:text-zinc-400 py-20">
            No rooms found. Create your first listing 🚀
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {rooms.map((room) => (
            <div
              key={room._id}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition flex flex-col"
            >

              {/* IMAGE */}
              <div className="relative h-44 bg-gray-200 dark:bg-zinc-800 w-full overflow-hidden">
                {room.image ? (
                  <Image
                    src={room.image}
                    alt={room.roomName || 'Room listing'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                    No image available
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-5 flex-1 flex flex-col justify-between">

                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {room.roomName}
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1 line-clamp-2">
                    {room.description}
                  </p>

                  {/* INFO */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-zinc-400 mt-3">

                    <span className="flex items-center gap-1">
                      <FiMapPin /> {room.floor || 'N/A'}
                    </span>

                    <span className="flex items-center gap-1">
                      <FiUsers /> {room.capacity}
                    </span>

                    <span className="flex items-center gap-1">
                      <FiDollarSign /> {room.hourlyRate}/hr
                    </span>

                  </div>

                  {/* AMENITIES */}
                  <AmenityChips amenities={room.amenities} />
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 mt-5">
                  <button
                    onClick={() => setDeleteTarget(room)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition"
                  >
                    <FiTrash2 size={15} />
                    Delete Listing
                  </button>
                </div>

              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                <FiAlertTriangle className="text-red-500 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Delete Listing?</h3>
            </div>
            <p className="text-slate-600 dark:text-zinc-400 text-sm mb-4">
              Are you sure you want to delete <span className="font-semibold text-slate-800 dark:text-slate-200">&quot;{deleteTarget.roomName}&quot;</span>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition flex items-center gap-2 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}