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