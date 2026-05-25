'use client';

import { authClient } from '@/lib/auth-client';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FiCheckCircle, FiXCircle, FiX, FiAlertCircle } from 'react-icons/fi';

/* ═══════════════════════════════════════════
   TOAST COMPONENT
═══════════════════════════════════════════ */
const Toast = ({ toasts, removeToast }) => (
  <div className="fixed top-5 right-5 z-9999 flex flex-col gap-3 pointer-events-none">
    <AnimatePresence>
      {toasts.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.85 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          className={`pointer-events-auto flex items-start gap-3 px-4 py-3.5
            rounded-2xl shadow-2xl border backdrop-blur-sm min-w-65 max-w-85
            ${t.type === 'success'
              ? 'bg-emerald-50/95 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : t.type === 'warning'
              ? 'bg-amber-50/95 dark:bg-amber-950/90 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
              : 'bg-red-50/95 dark:bg-red-950/90 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
            }`}
        >
          {t.type === 'success'
            ? <FiCheckCircle size={18} className="mt-0.5 shrink-0 text-emerald-500" />
            : t.type === 'warning'
            ? <FiAlertCircle size={18} className="mt-0.5 shrink-0 text-amber-500" />
            : <FiXCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
          }
          <div className="flex-1 text-sm font-medium leading-snug">{t.msg}</div>
          <button
            onClick={() => removeToast(t.id)}
            className="mt-0.5 shrink-0 opacity-50 hover:opacity-100 transition"
          >
            <FiX size={14} />
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const BookinButton = ({ room, token }) => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [bookingCount, setBookingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const {
    _id,
    roomName,
    description,
    image,
    amenities,
    capacity,
    floor,
    hourlyRate,
  } = room;

  /* ── toast helpers ── */
  const addToast = (msg, type = 'success') => {
    // eslint-disable-next-line react-hooks/purity
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => removeToast(id), 4000);
  };
  const removeToast = (id) =>
    setToasts((p) => p.filter((t) => t.id !== id));

  /* ── cost calculation (logic unchanged) ── */
  const calculateCost = () => {
    if (!startTime || !endTime) return 0;
    const start = parseInt(startTime.split(':')[0]);
    const end = parseInt(endTime.split(':')[0]);
    if (end <= start) return 0;
    return (end - start) * hourlyRate;
  };

  /* ── booking handler (logic unchanged, alert → toast) ── */
  const handlebooking = async () => {
    try {
      if (!user) {
        addToast('Please login first to book a room.', 'error');
        return;
      }

      if (!date) {
        addToast('Please select a date before booking.', 'warning');
        return;
      }

      if (!startTime) {
        addToast('Please select a start time.', 'warning');
        return;
      }

      if (!endTime) {
        addToast('Please select an end time.', 'warning');
        return;
      }

      const start = parseInt(startTime.split(':')[0]);
      const end = parseInt(endTime.split(':')[0]);

      if (end <= start) {
        addToast('End time must be greater than start time.', 'warning');
        return;
      }

      setLoading(true);

      const bookingData = {
        roomId: _id,
        date,
        startTime,
        endTime,
        totalCost: calculateCost(),
      };

      const res = await fetch('http://localhost:5000/bookings', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();

      if (!res.ok) {
        addToast(data.message || 'Booking failed. Please try again.', 'error');
        return;
      }

      addToast('🎉 Booking confirmed! Redirecting…', 'success');
      setBookingCount((prev) => prev + 1);
      setTimeout(() => router.push('/mybookings'), 1500);
    } catch (err) {
      console.error('Booking error:', err);
      addToast('Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  /* ── today's date for min ── */
  const today = new Date().toISOString().split('T')[0];

  const inputCls = `w-full px-4 py-2.5 rounded-xl text-sm
    border border-slate-200 dark:border-zinc-700
    bg-slate-50 dark:bg-zinc-800
    text-slate-800 dark:text-white
    focus:outline-none focus:ring-2 focus:ring-indigo-500
    transition`;

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />

      <div className="space-y-4">

        {/* DATE */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400 mb-1.5 block">
            Date
          </label>
          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            className={inputCls}
          />
        </div>

        {/* START + END TIME — side by side on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400 mb-1.5 block">
              Start Time
            </label>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={inputCls}
            >
              <option value="">Select start time</option>
              {['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400 mb-1.5 block">
              End Time
            </label>
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={inputCls}
            >
              <option value="">Select end time</option>
              {['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* COST DISPLAY */}
        <div className="flex items-center justify-between px-4 py-3 rounded-xl
          bg-indigo-50 dark:bg-indigo-950/30
          border border-indigo-100 dark:border-indigo-900">
          <span className="text-sm text-slate-500 dark:text-zinc-400">Total Cost</span>
          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            ${calculateCost()}
          </span>
        </div>

        {/* BOOK BUTTON */}
        <button
          onClick={handlebooking}
          disabled={loading}
          className="w-full py-3.5 rounded-2xl
            bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed
            text-white font-semibold text-base
            shadow-md shadow-indigo-500/30
            transition-all duration-150
            flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Booking…
            </>
          ) : 'Book This Room'}
        </button>

        {/* COUNTER */}
        {bookingCount > 0 && (
          <p className="text-center text-xs text-slate-400 dark:text-zinc-500">
            Bookings this session: {bookingCount}
          </p>
        )}

      </div>
    </>
  );
};

export default BookinButton;