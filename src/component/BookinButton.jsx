'use client';

import { authClient } from '@/lib/auth-client';
import React, { useState } from 'react';

const BookinButton = ({ room, token }) => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [bookingCount, setBookingCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    _id,
    roomName,
    description,
    image,
    amenities,
    capacity,
    floor,
    hourlyRate
  } = room;

  // 💰 cost calculation
  const calculateCost = () => {
    if (!startTime || !endTime) return 0;

    const start = parseInt(startTime.split(':')[0]);
    const end = parseInt(endTime.split(':')[0]);

    if (end <= start) return 0;

    return (end - start) * hourlyRate;
  };

  // 🚀 BOOKING FUNCTION
  const handlebooking = async () => {
    try {
      if (!user) {
        alert("Please login first");
        return;
      }

      if (!date || !startTime || !endTime) {
        alert("Please select date and time");
        return;
      }

      const start = parseInt(startTime.split(':')[0]);
      const end = parseInt(endTime.split(':')[0]);

      if (end <= start) {
        alert("End time must be greater than start time");
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

      const res = await fetch("http://localhost:5000/bookings", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Booking failed");
        return;
      }

      alert("🎉 Booking successful!");
      setBookingCount(prev => prev + 1);

    } catch (err) {
      console.error("Booking error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">

      {/* DATE */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />

      {/* START TIME */}
      <select
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      >
        <option value="">Start Time</option>
        <option>08:00</option>
        <option>09:00</option>
        <option>10:00</option>
        <option>11:00</option>
        <option>12:00</option>
        <option>13:00</option>
        <option>14:00</option>
        <option>15:00</option>
        <option>16:00</option>
        <option>17:00</option>
      </select>

      {/* END TIME */}
      <select
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      >
        <option value="">End Time</option>
        <option>09:00</option>
        <option>10:00</option>
        <option>11:00</option>
        <option>12:00</option>
        <option>13:00</option>
        <option>14:00</option>
        <option>15:00</option>
        <option>16:00</option>
        <option>17:00</option>
        <option>18:00</option>
      </select>

      {/* COST DISPLAY */}
      <p className="text-sm text-gray-500">
        Total Cost: <span className="font-bold">${calculateCost()}</span>
      </p>

      {/* BUTTON */}
      <button
        onClick={handlebooking}
        disabled={loading}
        className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-lg shadow-md transition"
      >
        {loading ? "Booking..." : "Book This Room"}
      </button>

      {/* COUNTER */}
      <p className="text-center text-sm text-gray-500">
        Total bookings: {bookingCount}
      </p>

    </div>
  );
};

export default BookinButton;