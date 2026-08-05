'use client';

import { useState, useEffect, useCallback } from 'react';
import RoomCard from '@/component/RoomCard';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const AMENITY_OPTIONS = [
  'Whiteboard',
  'Projector',
  'Wi-Fi',
  'Power Outlets',
  'Quiet Zone',
  'Air Conditioning',
];

const AllRoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (selectedAmenities.length > 0) params.set('amenities', selectedAmenities.join(','));
      if (minRate) params.set('minRate', minRate);
      if (maxRate) params.set('maxRate', maxRate);

      // Fixed: correct endpoint is /room (matches server route)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room?${params.toString()}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Failed to fetch rooms');
      const data = await res.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, [search, selectedAmenities, minRate, maxRate]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRooms();
  }, [fetchRooms]);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedAmenities([]);
    setMinRate('');
    setMaxRate('');
  };

  const hasFilters = search || selectedAmenities.length > 0 || minRate || maxRate;
  const activeFilterCount = selectedAmenities.length + (minRate ? 1 : 0) + (maxRate ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">

      {/* Page Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">All Study Rooms</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm">
            Find the perfect space for focused study
          </p>

          {/* Search + Filter bar */}
          <div className="mt-5 flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-50 max-w-lg">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by name, description, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:text-white"
              />
            </div>

            <button
              onClick={() => setShowFilter((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition ${
                showFilter
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800'
              }`}
            >
              <FiFilter size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-white text-indigo-600 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm text-red-500 border border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10 transition"
              >
                <FiX size={14} />
                Clear
              </button>
            )}
          </div>

          {/* Filter panel */}
          {showFilter && (
            <div className="mt-4 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50 space-y-4">

              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
                  Amenities
                </p>
                <div className="flex flex-wrap gap-2">
                  {AMENITY_OPTIONS.map((a) => (
                    <button
                      key={a}
                      onClick={() => toggleAmenity(a)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition ${
                        selectedAmenities.includes(a)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:border-indigo-300'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
                  Hourly Rate ($)
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minRate}
                    onChange={(e) => setMinRate(e.target.value)}
                    min="0"
                    className="w-24 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:text-white"
                  />
                  <span className="text-slate-400 text-sm">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxRate}
                    onChange={(e) => setMaxRate(e.target.value)}
                    min="0"
                    className="w-24 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Room Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-zinc-900 rounded-2xl h-80" />
            ))}
          </div>
        )}

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-slate-500 dark:text-zinc-400 mb-5">
            {rooms.length} room{rooms.length !== 1 ? 's' : ''} found
            {search && <span> for &quot;{search}&quot;</span>}
          </p>
        )}

        {/* Empty state */}
        {!loading && rooms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-zinc-200 mb-1">
              No rooms found
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Cards */}
        {!loading && rooms.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRoomPage ;