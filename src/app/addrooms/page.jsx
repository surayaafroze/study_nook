'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { FiCheck } from 'react-icons/fi';

const AMENITY_OPTIONS = [
  'Whiteboard',
  'Projector',
  'Wi-Fi',
  'Power Outlets',
  'Quiet Zone',
  'Air Conditioning',
];

const AddRoomPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    roomName: '',
    description: '',
    image: '',
    floor: '',
    capacity: '',
    hourlyRate: '',
    amenities: [],
  });

  // -----------------------
  // Handle Input Change
  // -----------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------
  // Toggle Amenities
  // -----------------------
  const toggleAmenity = (amenity) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  // -----------------------
  // Submit Handler
  // -----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data: tokenData } = await authClient.token();

      if (!tokenData?.token) {
        alert('Unauthorized! Please login again.');
        return;
      }

      // validation
      if (!form.roomName.trim() || !form.description.trim()) {
        alert('Room name and description are required.');
        return;
      }

      const capacity = Number(form.capacity);
      const hourlyRate = Number(form.hourlyRate);

      if (!Number.isFinite(capacity) || !Number.isFinite(hourlyRate)) {
        alert('Capacity and hourly rate must be valid numbers.');
        return;
      }

      if (capacity <= 0 || hourlyRate <= 0) {
        alert('Capacity and hourly rate must be greater than 0.');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/room`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${tokenData.token}`,
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
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || 'Failed to add room');
      }

      alert('Room submitted successfully!');
      router.push('/my-listing');
    } catch (err) {
      alert(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // UI
  // -----------------------
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Add New Room</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Room Name */}
        <input
          type="text"
          name="roomName"
          value={form.roomName}
          onChange={handleChange}
          placeholder="Room Name"
          className="w-full border p-2 rounded"
        />

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
        />

        {/* Image */}
        <input
          type="text"
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full border p-2 rounded"
        />

        {/* Floor */}
        <input
          type="text"
          name="floor"
          value={form.floor}
          onChange={handleChange}
          placeholder="Floor"
          className="w-full border p-2 rounded"
        />

        {/* Capacity */}
        <input
          type="number"
          name="capacity"
          value={form.capacity}
          onChange={handleChange}
          placeholder="Capacity"
          className="w-full border p-2 rounded"
        />

        {/* Hourly Rate */}
        <input
          type="number"
          name="hourlyRate"
          value={form.hourlyRate}
          onChange={handleChange}
          placeholder="Hourly Rate"
          className="w-full border p-2 rounded"
        />

        {/* Amenities */}
        <div>
          <p className="font-semibold mb-2">Amenities</p>

          <div className="flex flex-wrap gap-2">
            {AMENITY_OPTIONS.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => toggleAmenity(item)}
                className={`px-3 py-1 border rounded flex items-center gap-1 ${
                  form.amenities.includes(item)
                    ? 'bg-green-100 border-green-500'
                    : ''
                }`}
              >
                {form.amenities.includes(item) && <FiCheck />}
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Add Room'}
        </button>
      </form>
    </div>
  );
};

export default AddRoomPage;