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