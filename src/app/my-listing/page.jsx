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
 