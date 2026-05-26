'use client';

import { authClient } from '@/lib/auth-client';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiCheck, FiCheckCircle, FiX, FiXCircle, FiAlertCircle } from 'react-icons/fi';

const AMENITY_OPTIONS = [
  'Whiteboard',
  'Projector',
  'Wi-Fi',
  'Power Outlets',
  'Quiet Zone',
  'Air Conditioning',
];

/* ═══════════════════════════════════════════
   TOAST
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
          <button onClick={() => removeToast(t.id)} className="mt-0.5 shrink-0 opacity-50 hover:opacity-100 transition">
            <FiX size={14} />
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
const AddRoomPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const [form, setForm] = useState({
    roomName: '',
    description: '',
    image: '',
    floor: '',
    capacity: '',
    hourlyRate: '',
    amenities: [],
  });

  /* ── toast helpers ── */
  const addToast = (msg, type = 'success') => {
    // eslint-disable-next-line react-hooks/purity
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => removeToast(id), 4000);
  };
  const removeToast = (id) => setToasts((p) => p.filter((t) => t.id !== id));

  /* ── handlers (logic unchanged) ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (amenity) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data: tokenData } = await authClient.token();

      if (!tokenData?.token) {
        addToast('Unauthorized! Please login again.', 'error');
        return;
      }

      if (!form.roomName.trim() || !form.description.trim()) {
        addToast('Room name and description are required.', 'warning');
        return;
      }

      const capacity = Number(form.capacity);
      const hourlyRate = Number(form.hourlyRate);

      if (!Number.isFinite(capacity) || !Number.isFinite(hourlyRate)) {
        addToast('Capacity and hourly rate must be valid numbers.', 'warning');
        return;
      }

      if (capacity <= 0 || hourlyRate <= 0) {
        addToast('Capacity and hourly rate must be greater than 0.', 'warning');
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${tokenData?.token}`,
        },
        body: JSON.stringify({
          roomName: form.roomName.trim(),
          description: form.description.trim(),
          image: form.image.trim(),
          floor: form.floor.trim(),
          capacity,
          hourlyRate,
          amenities: form.amenities,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || 'Failed to add room');
      }

      addToast('Room submitted successfully!', 'success');
      setTimeout(() => router.push('/my-listing'), 1500);
    } catch (err) {
      addToast(err?.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  /* ── shared input class ── */
  const inputCls = `w-full px-4 py-2.5 rounded-xl text-sm
    border border-slate-200 dark:border-zinc-700
    bg-slate-50 dark:bg-zinc-800
    text-slate-800 dark:text-white
    placeholder:text-slate-400 dark:placeholder:text-zinc-500
    focus:outline-none focus:ring-2 focus:ring-indigo-500
    transition`;

  /* ── stagger variants ── */
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 26 } },
  };

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />

      <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/30 to-slate-50
        dark:from-zinc-950 dark:via-indigo-950/10 dark:to-zinc-950
        px-4 py-10 sm:py-16">

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl
            rounded-3xl border border-slate-200/80 dark:border-zinc-800
            shadow-2xl shadow-indigo-100/30 dark:shadow-indigo-950/30
            px-6 py-10 sm:px-10">

            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

              {/* ── header ── */}
              <motion.div variants={item}>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Add New Room
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                  Fill in the details to list your study room.
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Room Name */}
                <motion.div variants={item}>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400 mb-1.5 block">
                    Room Name
                  </label>
                  <input
                    type="text"
                    name="roomName"
                    value={form.roomName}
                    onChange={handleChange}
                    placeholder="e.g. Focus Pod A"
                    className={inputCls}
                  />
                </motion.div>

                {/* Description */}
                <motion.div variants={item}>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400 mb-1.5 block">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the room..."
                    rows={3}
                    className={inputCls + ' resize-none'}
                  />
                </motion.div>

                {/* Image URL */}
                <motion.div variants={item}>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400 mb-1.5 block">
                    Image URL
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://..."
                    className={inputCls}
                  />
                </motion.div>

                {/* Floor + Capacity + Hourly Rate — responsive grid */}
                <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400 mb-1.5 block">
                      Floor
                    </label>
                    <input
                      type="text"
                      name="floor"
                      value={form.floor}
                      onChange={handleChange}
                      placeholder="e.g. Level 3"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400 mb-1.5 block">
                      Capacity
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={form.capacity}
                      onChange={handleChange}
                      placeholder="e.g. 8"
                      min={1}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400 mb-1.5 block">
                      Hourly Rate ($)
                    </label>
                    <input
                      type="number"
                      name="hourlyRate"
                      value={form.hourlyRate}
                      onChange={handleChange}
                      placeholder="e.g. 15"
                      min={0}
                      step="0.01"
                      className={inputCls}
                    />
                  </div>
                </motion.div>

                {/* Amenities */}
                <motion.div variants={item}>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400 mb-2 block">
                    Amenities
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AMENITY_OPTIONS.map((amenity) => {
                      const active = form.amenities.includes(amenity);
                      return (
                        <button
                          type="button"
                          key={amenity}
                          onClick={() => toggleAmenity(amenity)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium
                            flex items-center gap-1.5 border transition-all duration-150
                            ${active
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:border-indigo-400'
                            }`}
                        >
                          {active && <FiCheck size={11} />}
                          {amenity}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Submit */}
                <motion.div variants={item}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl text-sm font-semibold text-white
                      bg-indigo-600 hover:bg-indigo-700
                      dark:bg-indigo-500 dark:hover:bg-indigo-600
                      shadow-md shadow-indigo-500/30
                      disabled:opacity-60 disabled:cursor-not-allowed
                      flex items-center justify-center gap-2
                      transition-all duration-150 active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Submitting…
                      </>
                    ) : 'Add Room'}
                  </button>
                </motion.div>

              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AddRoomPage;