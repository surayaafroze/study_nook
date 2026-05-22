'use client';

import { authClient } from '@/lib/auth-client';
import React, { useState } from 'react';

const BookinButton = ({ room,token }) => {

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [bookingCount, setBookingCount] = useState(0);
  const [deleteCount, setDeleteCount] = useState(0);

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

  const handlebooking = async () => {

    if (!user) {
      alert("Please login first");
      return;
    }

    const bookingData = {
      userId: user.id,
      userImage: user.image,
      userName: user.name,
      userEmail: user.email,

      bookingId: _id,
      roomName,
      description,
      image,
      amenities,
      capacity,
      floor,
      hourlyRate,
    };

    const res = await fetch("http://localhost:5000/bookings", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    const data = await res.json();

    if (data.insertedId) {
      alert("Booking Successful");

      setBookingCount(prev => prev + 1);
    }
  };

  // ❌ DELETE COUNT (added only)
  const handleDelete = async (bookingId) => {

    const res = await fetch(`http://localhost:5000/bookings/${bookingId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.deletedCount > 0) {
      alert("Deleted Successfully");

      setDeleteCount(prev => prev + 1);
    }
  };

  return (
    <div>

      <button
        onClick={handlebooking}
        className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg shadow-md transition"
      >
        Book This Room
      </button>

      {/* COUNTERS */}
      <p className="text-center text-sm text-gray-500 mt-2">
        Total bookings: {bookingCount}
      </p>

      <p className="text-center text-sm text-red-400">
        Deleted bookings: {deleteCount}
      </p>

    </div>
  );
};

export default BookinButton;