"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { FiMapPin, FiUsers, FiClock, FiCalendar, FiMail, FiX, FiAlertTriangle } from "react-icons/fi";
import toast from "react-hot-toast";

function isFuture(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) >= today;
}

function CancelModal({ booking, onConfirm, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <FiAlertTriangle className="text-red-500 text-lg" />
          </div>
          <h3 className="text-lg font-semibold">Cancel Booking?</h3>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
          You are about to cancel your booking for:
        </p>
        <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-3 mb-5 space-y-1 text-sm">
          {/* ✅ nested room object থেকে নিন */}
          <p className="font-semibold">{booking?.room?.roomName}</p>
          <p className="text-slate-500 flex items-center gap-1">
            <FiCalendar size={13} /> {booking?.date}
          </p>
          <p className="text-slate-500 flex items-center gap-1">
            <FiClock size={13} /> {booking?.startTime} – {booking?.endTime}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition disabled:opacity-60"
          >
            {loading ? "Cancelling..." : "Yes, Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles =
    status === "confirmed"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles}`}>
      {status === "confirmed" ? "Confirmed" : "Cancelled"}
    </span>
  );
}

const MyBookings = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [jwtToken, setJwtToken] = useState(null);

  useEffect(() => {
    if (!session) return;
    const fetchJwt = async () => {
      try {
        const res = await fetch('/api/auth/token', { credentials: 'include' });
        const data = await res.json();
        setJwtToken(data.token);
      } catch (err) {
        console.error('Failed to get JWT:', err);
      }
    };
    fetchJwt();
  }, [session]);

 useEffect(() => {
  if (!jwtToken) return;

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/my`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      // ✅ শুধু confirmed bookings দেখান
      const onlyConfirmed = Array.isArray(data)
        ? data.filter((b) => b.status === "confirmed")
        : [];
      setBookings(onlyConfirmed);
    } catch {
      toast.error("Could not load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  fetchBookings();
}, [jwtToken]);


const handleCancel = async () => {
  if (!cancelTarget || !jwtToken) return;
  setCancelLoading(true);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/bookings/${cancelTarget._id}/cancel`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${jwtToken}` },
      }
    );
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Cancel failed");
    }

    // ✅ remove না করে status update করুন
    setBookings((prev) =>
      prev.map((b) =>
        b._id === cancelTarget._id ? { ...b, status: "cancelled" } : b
      )
    );

    toast.success("Booking cancelled");
  } catch (err) {
    toast.error(err.message || "Something went wrong");
  } finally {
    setCancelLoading(false);
    setCancelTarget(null);
  }
};

  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;
  const totalSpent = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + (Number(b.totalCost) || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 py-12">
      {cancelTarget && (
        <CancelModal
          booking={cancelTarget}
          onConfirm={handleCancel}
          onClose={() => setCancelTarget(null)}
          loading={cancelLoading}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-10">
        {/* LEFT */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-slate-400 text-sm mb-8">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""} total
          </p>

          {loading ? (
            <div className="space-y-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-zinc-900 rounded-3xl h-44" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-1">No bookings yet</h3>
              <p className="text-slate-400 text-sm">Browse rooms and book your perfect study spot.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="flex flex-col md:flex-row bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-zinc-800 hover:shadow-md transition-shadow"
                >
                  {/* ✅ image */}
                  <div className="relative w-full md:w-56 h-48 md:h-auto shrink-0">
                    <Image
                      src={b.room?.image || "https://placehold.co/600x400?text=Room"}
                      alt={b.room?.roomName || "Room"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        {/* ✅ roomName */}
                        <h2 className="text-xl font-bold leading-tight">
                          {b.room?.roomName || "Unknown Room"}
                        </h2>
                        <StatusBadge status={b.status} />
                      </div>
                      {/* ✅ description */}
                      <p className="text-sm text-slate-400 line-clamp-2">
                        {b.room?.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-zinc-800 rounded-xl px-3 py-2">
                        <FiCalendar size={14} className="text-indigo-400" />
                        <span className="font-medium">{b.date || "—"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-zinc-800 rounded-xl px-3 py-2">
                        <FiClock size={14} className="text-indigo-400" />
                        <span className="font-medium">{b.startTime} – {b.endTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl px-3 py-2">
                        <span className="text-emerald-600 font-semibold">
                          ${Number(b.totalCost || 0).toFixed(2)}
                        </span>
                      </div>
                      {/* ✅ floor, capacity */}
                      {b.room?.floor && (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <FiMapPin size={13} /> {b.room.floor}
                        </div>
                      )}
                      {b.room?.capacity && (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <FiUsers size={13} /> {b.room.capacity} seats
                        </div>
                      )}
                    </div>

                    {b.specialNote && (
                      <p className="text-xs text-slate-400 italic border-l-2 border-indigo-300 pl-2">
                        &quot;{b.specialNote}&quot;
                      </p>
                    )}

                    {/* ✅ cancel button — cancelled হলে দেখাবে না */}
                    {b.status === "confirmed" && isFuture(b.date) && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => setCancelTarget(b)}
                          className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl px-4 py-1.5 transition"
                        >
                          <FiX size={14} /> Cancel Booking
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-72 space-y-4">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 text-center">
            <img
              src={user?.image || "https://placehold.co/96x96"}
              className="w-20 h-20 rounded-full mx-auto object-cover ring-2 ring-indigo-200"
              alt={user?.name}
            />
            <h2 className="mt-3 font-bold text-lg">{user?.name}</h2>
            <p className="text-sm text-slate-400 flex justify-center items-center gap-1 mt-1">
              <FiMail size={13} /> {user?.email}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 space-y-4">
            <h3 className="font-semibold text-sm text-slate-400 uppercase tracking-wider">Overview</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Bookings</span>
                <b>{bookings.length}</b>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Confirmed</span>
                <b className="text-emerald-600">{confirmed}</b>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cancelled</span>
                <b className="text-red-500">{cancelled}</b>
              </div>
              <div className="border-t border-slate-100 dark:border-zinc-800 pt-3 flex justify-between">
                <span className="text-slate-500">Total Spent</span>
                <b className="text-indigo-600">${totalSpent.toFixed(2)}</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;