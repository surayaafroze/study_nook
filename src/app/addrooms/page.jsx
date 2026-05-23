'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FiPlus, FiCheck } from 'react-icons/fi';
import { authClient } from '@/lib/auth-client';

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
    const { data: tokenData } = await authClient.token();
    e.preventDefault();

    // validation
    if (!form.roomName.trim() || !form.description.trim()) {
      toast.error('Room name and description are required.');
      return;
    }

    const capacity = Number(form.capacity);
    const hourlyRate = Number(form.hourlyRate);

    if (!Number.isFinite(capacity) || !Number.isFinite(hourlyRate)) {
      toast.error('Capacity and hourly rate must be valid numbers.');
      return;
    }

    if (capacity <= 0 || hourlyRate <= 0) {
      toast.error('Capacity and hourly rate must be greater than 0.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/room`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${tokenData?.token}`,
          },
          body: JSON.stringify({
            roomName: form.roomName.trim(),
            description: form.description.trim(),
            image: form.image?.trim() || '',
            floor: form.floor?.trim() || '',
            capacity,
            hourlyRate,
            amenities: form.amenities,
          }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add room');
      }

      toast.success('Room added successfully!');
      router.push('/my-listing');
    } catch (err) {
      toast.error(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 py-10">
      <div className="max-w-2xl mx-auto px-4">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Add a Room
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">
            Fill in the details below to list your study room.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm p-6 space-y-5"
        >

          {/* Room Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
              Room Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="roomName"
              value={form.roomName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border bg-transparent text-sm"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border bg-transparent text-sm resize-none"
              required
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium">Image URL</label>
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border bg-transparent text-sm"
            />
          </div>

          {/* Floor / Capacity / Rate */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              name="floor"
              value={form.floor}
              onChange={handleChange}
              placeholder="Floor"
              className="px-4 py-2.5 rounded-xl border bg-transparent text-sm"
            />

            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              placeholder="Capacity"
              className="px-4 py-2.5 rounded-xl border bg-transparent text-sm"
            />

            <input
              type="number"
              name="hourlyRate"
              value={form.hourlyRate}
              onChange={handleChange}
              placeholder="Rate"
              className="px-4 py-2.5 rounded-xl border bg-transparent text-sm"
            />
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Amenities
            </label>

            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((amenity) => {
                const selected = form.amenities.includes(amenity);

                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1.5 rounded-full border text-sm flex items-center gap-1 ${
                      selected
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : ''
                    }`}
                  >
                    {selected && <FiCheck size={12} />}
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white"
          >
            {loading ? 'Adding...' : (
              <>
                <FiPlus size={16} />
                Add Room
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddRoomPage;