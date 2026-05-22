"use client";
 
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client"; // adjust import path
import { FiMapPin, FiUsers, FiClock, FiCalendar, FiMail, FiX, FiAlertTriangle } from "react-icons/fi";
import toast from "react-hot-toast";
 
/* ─────────────────────────────────────────────
   Helper: is the booking date still in future?
───────────────────────────────────────────── */
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
          <p className="font-semibold">{booking.roomName}</p>
          <p className="text-slate-500 flex items-center gap-1">
            <FiCalendar size={13} /> {booking.date}
          </p>
          <p className="text-slate-500 flex items-center gap-1">
            <FiClock size={13} /> {booking.startTime} – {booking.endTime}
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
 
/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const MyBookings = () => {
  const { data: session } = useSession();
  const user = session?.user;
 
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null); // booking object
  const [cancelLoading, setCancelLoading] = useState(false);
 
  /* fetch bookings */
  useEffect(() => {
    if (!user?.id) return;
 
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const token = session?.session?.token; // adjust based on your auth lib
        const res = await fetch(`http://localhost:5000/bookings/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Could not load bookings");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
 
    fetchBookings();
  }, [user?.id]);
 
  /* cancel handler */
  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelLoading(true);
    try {
      const token = session?.session?.token;
      const res = await fetch(
        `http://localhost:5000/bookings/${cancelTarget._id}/cancel`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Cancel failed");
      }
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
 
  /* stats */
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;
  const totalSpent = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + (Number(b.totalCost) || 0), 0);