

import BookinButton from '@/component/BookinButton';
import EditRoomModal from '@/component/EditRoomModal';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiUsers, FiMapPin, FiWifi } from 'react-icons/fi';

// ─── Helper: token আনো, error হলে null দাও ──────────────────────────────────
async function getAuthToken() {
  try {
    const { token } = await auth.api.getToken({ headers: await headers() });
    return token ?? null;
  } catch {
    return null;
  }
}

// ─── Helper: room fetch করো (token optional) ─────────────────────────────────
async function fetchRoom(id, token) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room/${id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });
  return res; // caller নিজে status handle করবে
}



// ─── Metadata ────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    // token দিয়ে চেষ্টা করো; না পেলেও fetch যাবে (public room হলে কাজ করবে)
    const token = await getAuthToken();
    const res = await fetchRoom(id, token);

    if (!res.ok) {
      return {
        title: 'Room Not Found | studyNook',
        description: 'This room does not exist or has been removed.',
      };
    }

    const room = await res.json();

    return {
      title: `${room.roomName} | studyNook`,
      description: room.description || 'Study room details',
      openGraph: {
        title: room.roomName,
        description: room.description,
        images: room.image ? [{ url: room.image }] : [],
      },
    };
  } catch {
    // network error বা parse error — silent fallback
    return {
      title: 'studyNook | Room Details',
      description: 'Browse and book study rooms.',
    };
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────
const RoomDetailsPage = async ({ params }) => {
  const { id } = await params;

  // Token + session একসাথে আনো
  const [token, session] = await Promise.allSettled([
    getAuthToken(),
    auth.api.getSession({ headers: await headers() }).catch(() => null),
  ]);

  const resolvedToken = token.status === 'fulfilled' ? token.value : null;
  const resolvedSession = session.status === 'fulfilled' ? session.value : null;
  const currentUserId = resolvedSession?.user?.id ?? null;

  // Room fetch
  let room = null;
  let error = null;

  try {
    const res = await fetchRoom(id, resolvedToken);

    if (res.status === 401) {
      error = 'unauthorized';
    } else if (res.status === 404) {
      error = 'notfound';
    } else if (!res.ok) {
      error = 'error';
    } else {
      room = await res.json();
    }
  } catch {
    error = 'error';
  }

  // ── Error states ────────────────────────────────────────────────────────────
  if (error === 'unauthorized') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-zinc-950 px-4 text-center">
        <div className="text-5xl mb-2">🔒</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Login Required</h2>
        <p className="text-slate-500 dark:text-zinc-400 max-w-xs">
          You need to be logged in to view room details.
        </p>
        <Link
          href="/login"
          className="mt-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (error === 'notfound' || !room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-zinc-950 px-4 text-center">
        <div className="text-5xl mb-2">🏚️</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Room Not Found</h2>
        <p className="text-slate-500 dark:text-zinc-400">This room may have been removed.</p>
        <Link
          href="/room"
          className="mt-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition"
        >
          Browse All Rooms
        </Link>
      </div>
    );
  }

  if (error === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-zinc-950 px-4 text-center">
        <div className="text-5xl mb-2">⚠️</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Something went wrong</h2>
        <p className="text-slate-500 dark:text-zinc-400">Please try again later.</p>
        <Link
          href="/room"
          className="mt-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition"
        >
          Browse All Rooms
        </Link>
      </div>
    );
  }

  const isOwner =
    Boolean(room.userId) &&
    Boolean(currentUserId) &&
    String(room.userId) === String(currentUserId);

  // ── Main UI ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 py-10">
      <div className="max-w-6xl mx-auto px-4">

        {/* Back link */}
        <Link
          href="/room"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
        >
          <FiArrowLeft size={14} />
          Back to Rooms
        </Link>

        {/* HERO IMAGE */}
        <div className="relative w-full h-80 md:h-125 rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src={room.image || 'https://placehold.co/1200x500?text=Study+Room'}
            alt={room.roomName}
            fill
            className="object-cover hover:scale-105 transition duration-500"
            priority
            unoptimized
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
              <p className="mt-2 text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                <FiMapPin size={14} className="text-indigo-500" />
                {room.floor || 'Floor not specified'}
              </p>

              {/* Owner badge */}
              {isOwner && (
                <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                  bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400
                  border border-amber-200 dark:border-amber-800 text-xs font-semibold">
                  👑 Your Listing
                </span>
              )}
            </div>

            {/* PRICE CARD */}
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-6 py-5 rounded-2xl shadow-lg text-center shrink-0">
              <p className="text-3xl font-bold">${room.hourlyRate}</p>
              <p className="text-sm opacity-80">per hour</p>
            </div>
          </div>

          {/* QUICK INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center gap-3">
              <FiUsers size={20} className="text-indigo-500 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Capacity</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{room.capacity} People</p>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center gap-3">
              <FiMapPin size={20} className="text-indigo-500 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Floor</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{room.floor || 'N/A'}</p>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center gap-3">
              <FiWifi size={20} className="text-indigo-500 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Total Bookings</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{room.bookingCount || 0}</p>
              </div>
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
          {room.amenities?.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                Amenities
              </h2>
              <div className="flex flex-wrap gap-3">
                {room.amenities.map((item, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 text-sm font-medium border border-indigo-100 dark:border-zinc-800"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="mt-10 space-y-4">
            <BookinButton room={room} token={resolvedToken} />
            <p className="text-center text-xs text-slate-400">
              Instant confirmation • Free cancellation available
            </p>

            {isOwner && (
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
                <p className="text-center text-xs text-slate-400 mb-3">
                  👑 You own this listing — you can edit it anytime
                </p>
                <EditRoomModal room={room} currentUserId={currentUserId} />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;