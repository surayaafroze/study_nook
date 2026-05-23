'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiUsers, FiMapPin, FiClock } from 'react-icons/fi';

const RoomCard = ({ room }) => {
  const { _id, roomName, description, image, url, floor, capacity, hourlyRate, amenities } = room || {};

  // Old data uses "url", new data uses "image" — handle both
  const roomImage = image || url || 'https://placehold.co/600x400?text=Study+Room';

  // Old data stores amenities as a comma string, new data as array
  const safeAmenities = Array.isArray(amenities)
    ? amenities
    : typeof amenities === 'string' && amenities.trim()
    ? amenities.split(',').map((a) => a.trim())
    : [];

  const visibleAmenities = safeAmenities.slice(0, 3);
  const extraCount = safeAmenities.length - 3;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">

      {/* Image */}
      <div className="relative h-52 w-full">
        <Image
          src={roomImage}
          alt={roomName || 'Room'}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          unoptimized
        />
        <span className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          ${hourlyRate || 0}/hr
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">

        <div>
          <h2 className="font-bold text-lg text-slate-800 dark:text-white line-clamp-1">
            {roomName || 'Unnamed Room'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 line-clamp-2 mt-1">
            {description || 'No description available.'}
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <FiMapPin size={13} className="text-indigo-500" />
            {floor || 'N/A'}
          </span>
          <span className="flex items-center gap-1">
            <FiUsers size={13} className="text-indigo-500" />
            {capacity || 0} seats
          </span>
          <span className="flex items-center gap-1">
            <FiClock size={13} className="text-indigo-500" />
            Hourly
          </span>
        </div>

        {safeAmenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visibleAmenities.map((item) => (
              <span
                key={item}
                className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800"
              >
                {item}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
                +{extraCount} more
              </span>
            )}
          </div>
        )}

        <Link href={`/room/${_id}`} className="mt-auto">
          <button className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">
            View Details
          </button>
        </Link>

      </div>
    </div>
  );
};

export default RoomCard;