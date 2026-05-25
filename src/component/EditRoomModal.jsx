'use client';

import { useState, useEffect, useRef } from 'react';
import { authClient } from '@/lib/auth-client';
import { FiX, FiCheck, FiEdit2, FiUpload, FiLoader } from 'react-icons/fi';

const AMENITY_OPTIONS = [
  'Whiteboard',
  'Projector',
  'Wi-Fi',
  'Power Outlets',
  'Quiet Zone',
  'Air Conditioning',
];

// ─── tiny toast ───────────────────────────────────────────────────────────────
const Toast = ({ msg, type }) => (
  <div
    className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-9999 px-5 py-3 rounded-xl shadow-xl text-sm font-medium
      flex items-center gap-2 transition-all
      ${type === 'success'
        ? 'bg-emerald-600 text-white'
        : 'bg-red-500 text-white'
      }`}
  >
    {type === 'success' ? <FiCheck size={15} /> : <FiX size={15} />}
    {msg}
  </div>
);

// ─── main component ───────────────────────────────────────────────────────────
const EditRoomModal = ({ room, currentUserId, onUpdated }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const overlayRef = useRef(null);

  const [form, setForm] = useState({
    roomName: '',
    description: '',
    image: '',
    floor: '',
    capacity: '',
    hourlyRate: '',
    amenities: [],
  });

  // Only the owner sees the button
  const isOwner = room?.userId && currentUserId && room.userId === currentUserId;

  // Pre-fill form when modal opens
  useEffect(() => {
    if (open && room) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        roomName: room.roomName || '',
        description: room.description || '',
        image: room.image || '',
        floor: room.floor || '',
        capacity: room.capacity ?? '',
        hourlyRate: room.hourlyRate ?? '',
        amenities: Array.isArray(room.amenities) ? [...room.amenities] : [],
      });
    }
  }, [open, room]);

  if (!isOwner) return null;

  // ── helpers ──────────────────────────────────────────────────────────────
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const toggleAmenity = (item) => {
    setForm((p) => ({
      ...p,
      amenities: p.amenities.includes(item)
        ? p.amenities.filter((a) => a !== item)
        : [...p.amenities, item],
    }));
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) setOpen(false);
  };

  // ── submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.roomName.trim() || !form.description.trim()) {
      showToast('Room name and description are required.', 'error');
      return;
    }

    const capacity = Number(form.capacity);
    const hourlyRate = Number(form.hourlyRate);

    if (!Number.isFinite(capacity) || capacity <= 0) {
      showToast('Capacity must be a positive number.', 'error');
      return;
    }
    if (!Number.isFinite(hourlyRate) || hourlyRate <= 0) {
      showToast('Hourly rate must be a positive number.', 'error');
      return;
    }

    try {
      setLoading(true);

      const { data: tokenData } = await authClient.token();
      if (!tokenData?.token) {
        showToast('Session expired. Please log in again.', 'error');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/room/${room._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
            roomName: form.roomName.trim(),
            description: form.description.trim(),
            image: form.image.trim() || room.image,
            floor: form.floor.trim(),
            capacity,
            hourlyRate,
            amenities: form.amenities,
          }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data?.message || 'Update failed');

      showToast('Room updated successfully');
      setOpen(false);
      onUpdated?.(data.data); // bubble updated room up to parent
    } catch (err) {
      showToast(err?.message || 'Something went wrong.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── trigger button ── */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
          bg-amber-500 hover:bg-amber-600 active:scale-95
          text-white text-sm font-semibold shadow-md
          transition-all duration-150"
      >
        <FiEdit2 size={15} />
        Edit Room
      </button>

      {/* ── modal overlay ── */}
      {open && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-center justify-center
            bg-black/60 backdrop-blur-sm px-4"
        >
          <div
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto
              bg-white dark:bg-zinc-900
              rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-700
              animate-in fade-in zoom-in-95 duration-200"
          >
            {/* header */}
            <div className="sticky top-0 z-10 flex items-center justify-between
              px-6 pt-6 pb-4
              bg-white dark:bg-zinc-900
              border-b border-slate-100 dark:border-zinc-800"
            >
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Edit Room
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Only you can see and use this form
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800
                  text-slate-500 dark:text-zinc-400 transition"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* form */}
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">

              {/* Room Name */}
              <Field label="Room Name">
                <input
                  type="text"
                  name="roomName"
                  value={form.roomName}
                  onChange={handleChange}
                  placeholder="e.g. Focus Pod A"
                  className={inputCls}
                />
              </Field>

              {/* Description */}
              <Field label="Description">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe the room..."
                  className={inputCls + ' resize-none'}
                />
              </Field>

              {/* Image URL */}
              <Field label="Image URL" hint="Leave blank to keep existing image">
                <div className="relative">
                  <FiUpload
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://..."
                    className={inputCls + ' pl-8'}
                  />
                </div>
              </Field>

              {/* Floor */}
              <Field label="Floor">
                <input
                  type="text"
                  name="floor"
                  value={form.floor}
                  onChange={handleChange}
                  placeholder="e.g. Level 3"
                  className={inputCls}
                />
              </Field>

              {/* Capacity + Hourly Rate (side by side) */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Capacity">
                  <input
                    type="number"
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    min={1}
                    placeholder="e.g. 8"
                    className={inputCls}
                  />
                </Field>
                <Field label="Hourly Rate ($)">
                  <input
                    type="number"
                    name="hourlyRate"
                    value={form.hourlyRate}
                    onChange={handleChange}
                    min={0}
                    step="0.01"
                    placeholder="e.g. 15"
                    className={inputCls}
                  />
                </Field>
              </div>

              {/* Amenities */}
              <Field label="Amenities">
                <div className="flex flex-wrap gap-2 mt-1">
                  {AMENITY_OPTIONS.map((item) => {
                    const active = form.amenities.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleAmenity(item)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium
                          flex items-center gap-1.5 border transition-all duration-150
                          ${active
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:border-indigo-400'
                          }`}
                      >
                        {active && <FiCheck size={11} />}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </Field>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200
                    dark:border-zinc-700 text-sm font-medium
                    text-slate-600 dark:text-zinc-300
                    hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700
                    text-white text-sm font-semibold shadow-md
                    disabled:opacity-60 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2 transition"
                >
                  {loading ? (
                    <>
                      <FiLoader size={14} className="animate-spin" />
                      Saving…
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── toast ── */}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
};

// ── tiny helpers ──────────────────────────────────────────────────────────────
const inputCls = `
  w-full px-3 py-2.5 rounded-xl text-sm
  bg-slate-50 dark:bg-zinc-800
  border border-slate-200 dark:border-zinc-700
  text-slate-800 dark:text-white
  placeholder:text-slate-400 dark:placeholder:text-zinc-500
  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
  transition
`.trim();

const Field = ({ label, hint, children }) => (
  <div className="space-y-1.5">
    <div className="flex items-baseline justify-between">
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400">
        {label}
      </label>
      {hint && <span className="text-xs text-slate-400">{hint}</span>}
    </div>
    {children}
  </div>
);

export default EditRoomModal;