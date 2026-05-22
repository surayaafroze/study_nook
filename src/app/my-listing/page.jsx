"use client";
 
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client"; // adjust path
import {
  FiEdit2,
  FiTrash2,
  FiAlertTriangle,
  FiPlus,
  FiMapPin,
  FiUsers,
  FiDollarSign,
  FiX,
  FiCheck,
} from "react-icons/fi";
import toast from "react-hot-toast";
import Link from "next/link";
function DeleteModal({ room, onConfirm, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <FiAlertTriangle className="text-red-500 text-lg" />
          </div>
          <h3 className="text-lg font-semibold">Delete Room?</h3>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">
          Permanently delete <strong>{room.roomName}</strong>? This cannot be undone and all bookings for this room will be affected.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}


const AMENITY_OPTIONS = [
  "Whiteboard",
  "Projector",
  "Wi-Fi",
  "Power Outlets",
  "Quiet Zone",
  "Air Conditioning",
];
 
function EditModal({ room, onSave, onClose, loading }) {
  const [form, setForm] = useState({
    roomName: room.roomName || "",
    description: room.description || "",
    image: room.image || "",
    floor: room.floor || "",
    capacity: room.capacity || "",
    hourlyRate: room.hourlyRate || "",
    amenities: room.amenities || [],
  });
 
  const toggle = (a) =>
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }));
 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg my-4">
        {/* header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-zinc-800">
          <h3 className="font-semibold text-lg">Edit Room</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <FiX />
          </button>
        </div>
 
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {[
            { label: "Room Name", key: "roomName", type: "text" },
            { label: "Image URL", key: "image", type: "text" },
            { label: "Floor", key: "floor", type: "text" },
            { label: "Capacity", key: "capacity", type: "number" },
            { label: "Hourly Rate ($)", key: "hourlyRate", type: "number" },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                {label}
              </label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          ))}
 
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            />
          </div>
 
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">
              Amenities
            </label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((a) => {
                const selected = form.amenities.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggle(a)}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition ${
                      selected
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "border-slate-200 dark:border-zinc-700 text-slate-500 hover:border-indigo-300"
                    }`}
                  >
                    {selected && <FiCheck size={11} />}
                    {a}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
 
        <div className="flex gap-3 p-5 border-t border-slate-100 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={loading}
            className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}


function AmenityChips({ amenities = [] }) {
  const visible = amenities.slice(0, 3);
  const extra = amenities.length - 3;
  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((a) => (
        <span
          key={a}
          className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
        >
          {a}
        </span>
      ))}
      {extra > 0 && (
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500">
          +{extra} more
        </span>
      )}
    </div>
  );
}
 

const MyListingsPage = () => {
  const { data: session } = useSession();
  const user = session?.user;
 
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
 
  const token = session?.session?.token; // adjust based on your auth library
 
  /* fetch my rooms */
  useEffect(() => {
    if (!user?.id) return;
    const fetchMyRooms = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/my-rooms", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setRooms(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Could not load your listings");
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyRooms();
  }, [user?.id]);


   const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/room/${deleteTarget._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Delete failed");
      setRooms((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      toast.success("Room deleted successfully");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setActionLoading(false);
      setDeleteTarget(null);
    }
  };

  const handleUpdate = async (formData) => {
    if (!editTarget) return;
    setActionLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/room/${editTarget._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Update failed");
      setRooms((prev) =>
        prev.map((r) =>
          r._id === editTarget._id ? { ...r, ...formData } : r
        )
      );
      toast.success("Room updated successfully");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setActionLoading(false);
      setEditTarget(null);
    }
  };
 
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 py-12">
      {deleteTarget && (
        <DeleteModal
          room={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          loading={actionLoading}
        />
      )}
      {editTarget && (
        <EditModal
          room={editTarget}
          onSave={handleUpdate}
          onClose={() => setEditTarget(null)}
          loading={actionLoading}
        />
      )}
 
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">My Listings</h1>
            <p className="text-slate-400 text-sm mt-1">
              {rooms.length} room{rooms.length !== 1 ? "s" : ""} listed
            </p>
          </div>
          <Link
            href="/add-room"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition"
          >
            <FiPlus /> Add Room
          </Link>
        </div>
 
        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white dark:bg-zinc-900 rounded-3xl h-72"
              />
            ))}
          </div>
        )}
 
        {/* Empty */}
        {!loading && rooms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold mb-1">No listings yet</h3>
            <p className="text-slate-400 text-sm mb-5">
              List a room and start earning.
            </p>
            <Link
              href="/add-room"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition"
            >
              <FiPlus /> Add Your First Room
            </Link>
          </div>
        )}

 {!loading && rooms.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-zinc-800 hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Image */}
                <div className="relative h-44 w-full">
                  <Image
                    src={room.image || "https://placehold.co/600x400?text=Room"}
                    alt={room.roomName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {/* booking count badge */}
                  {room.bookingCount > 0 && (
                    <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {room.bookingCount} booking{room.bookingCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
 
                {/* Content */}
                <div className="p-4 flex flex-col flex-1 gap-3">
                  <div>
                    <h2 className="font-bold text-lg leading-tight line-clamp-1">
                      {room.roomName}
                    </h2>
                    <p className="text-slate-400 text-sm line-clamp-2 mt-0.5">
                      {room.description}
                    </p>
                  </div>
 
                  <div className="flex gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <FiMapPin size={12} /> {room.floor}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiUsers size={12} /> {room.capacity}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiDollarSign size={12} /> ${room.hourlyRate}/hr
                    </span>
                  </div>
 
                  <AmenityChips amenities={room.amenities} />
 
 <div className="flex gap-2 mt-auto pt-2">
                    <button
                      onClick={() => setEditTarget(room)}
                      className="flex-1 flex items-center justify-center gap-1.5 text-sm border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl py-2 transition"
                    >
                      <FiEdit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(room)}
                      className="flex-1 flex items-center justify-center gap-1.5 text-sm text-red-500 border border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl py-2 transition"
                    >
                      <FiTrash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
 
export default MyListingsPage;

