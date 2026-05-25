"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiEdit2, FiTrash2, FiX, FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";

export default function RoomOwnerActions({ room, token }) {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    roomName: room.roomName || "",
    floor: room.floor || "",
    capacity: room.capacity || "",
    hourlyRate: room.hourlyRate || "",
    description: room.description || "",
    amenities: Array.isArray(room.amenities)
      ? room.amenities.join(", ")
      : room.amenities || "",
    image: room.image || "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* ── EDIT SUBMIT ── */
  const handleEditSubmit = async () => {
    if (!form.roomName.trim()) {
      toast.error("Room name is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/room/${room._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            capacity: Number(form.capacity),
            hourlyRate: Number(form.hourlyRate),
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      toast.success("Room updated successfully 🎉");
      setShowEditModal(false);
      router.refresh(); // re-fetch server component
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ── DELETE ── */
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/room/${room._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      toast.success("Room deleted");
      router.push("/room");
    } catch (err) {
      toast.error(err.message);
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      {/* ── ACTION BUTTONS ── */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setShowEditModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition"
        >
          <FiEdit2 size={15} />
          Edit Room
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition"
        >
          <FiTrash2 size={15} />
          Delete Room
        </button>
      </div>

      {/* ══════════ EDIT MODAL ══════════ */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowEditModal(false)}
          />

          {/* Modal Box */}
          <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-700 p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Edit Room
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 transition"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Room Name"
                name="roomName"
                value={form.roomName}
                onChange={handleChange}
                placeholder="e.g. Quiet Zone A"
              />
              <Field
                label="Floor"
                name="floor"
                value={form.floor}
                onChange={handleChange}
                placeholder="e.g. 3rd Floor"
              />
              <Field
                label="Capacity"
                name="capacity"
                type="number"
                value={form.capacity}
                onChange={handleChange}
                placeholder="e.g. 10"
              />
              <Field
                label="Hourly Rate ($)"
                name="hourlyRate"
                type="number"
                value={form.hourlyRate}
                onChange={handleChange}
                placeholder="e.g. 15"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe the room..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div className="mt-4">
              <Field
                label="Amenities (comma separated)"
                name="amenities"
                value={form.amenities}
                onChange={handleChange}
                placeholder="e.g. WiFi, Whiteboard, AC"
              />
            </div>

            {/* Image URL */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                Image URL{" "}
                <span className="text-xs text-slate-400">(leave blank to keep current)</span>
              </label>
              <div className="flex gap-2">
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {/* Preview */}
              {form.image && (
                <img
                  src={form.image}
                  alt="preview"
                  className="mt-3 h-28 w-full object-cover rounded-xl border border-slate-200 dark:border-zinc-700"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium transition"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ DELETE CONFIRM ══════════ */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative z-10 w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-700 p-8 text-center">
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Delete this room?
            </h3>
            <p className="text-slate-500 dark:text-zinc-400 text-sm mb-6">
              This action cannot be undone. All bookings for this room will also
              be removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-medium transition"
              >
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Reusable input field ── */
function Field({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}