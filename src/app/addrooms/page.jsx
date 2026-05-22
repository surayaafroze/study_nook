"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddRoomPage() {
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();

    const formdata = new FormData(e.currentTarget);

    // ✅ get all checkbox values as array
const amenities = formdata.getAll("amenities");

const addRooms = {
  roomName: formdata.get("roomName"),
  description: formdata.get("description"),
  image: formdata.get("image"),
  floor: formdata.get("floor"),
  capacity: Number(formdata.get("capacity")),
  hourlyRate: Number(formdata.get("hourlyRate")),
  amenities,
};

    console.log(addRooms);

    const res = await fetch("http://localhost:5000/addroom", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(addRooms),
    });

    const data = await res.json();
    console.log(data);

    // redirect after success
    router.push("/room");
  };

  const amenitiesOptions = [
    "Whiteboard",
    "Projector",
    "Wi-Fi",
    "Power Outlets",
    "Quiet Zone",
    "Air Conditioning",
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Add New Room
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Create a study room listing
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-5">

          <input
            type="text"
            name="roomName"
            placeholder="Room Name"
            className="w-full p-3 border rounded-lg bg-white dark:bg-zinc-950"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            rows={4}
            className="w-full p-3 border rounded-lg bg-white dark:bg-zinc-950"
            required
          />

          <input
            type="url"
            name="image"
            placeholder="Image URL"
            className="w-full p-3 border rounded-lg bg-white dark:bg-zinc-950"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

            <input
              type="text"
              name="floor"
              placeholder="Floor"
              className="p-3 border rounded-lg bg-white dark:bg-zinc-950"
              required
            />

            <input
              type="number"
              name="capacity"
              min="1"
              placeholder="Capacity"
              className="p-3 border rounded-lg bg-white dark:bg-zinc-950"
              required
            />

            <input
              type="number"
              name="hourlyRate"
              min="1"
              placeholder="Hourly Rate"
              className="p-3 border rounded-lg bg-white dark:bg-zinc-950"
              required
            />
          </div>

          {/* Amenities */}
          <div className="grid grid-cols-2 gap-2">
            {amenitiesOptions.map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer"
              >
                <input type="checkbox" name="amenities" value={item} />
                <span>{item}</span>
              </label>
            ))}
          </div>

          {/* Button */}
          <Link href='/my-listing'>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg transition"
          >
            Add Room
          </button>
          </Link>
        </form>
      </div>
    </div>
  );
}