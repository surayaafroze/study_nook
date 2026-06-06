import { FiBookOpen, FiUsers, FiAward, FiStar, FiCheckCircle, FiMapPin, FiZap, FiShield } from "react-icons/fi";
import Link from "next/link";




const stats = [
  { value: "12K+", label: "Active Students" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "50+", label: "Study Rooms" },
  { value: "5 Yrs", label: "Of Excellence" },
];

const values = [
  { icon: FiBookOpen, title: "Focus First", desc: "Every space is engineered to eliminate distraction and maximize deep, meaningful work." },
  { icon: FiUsers, title: "Community Driven", desc: "Great minds flourish together. We foster connections that go beyond just sharing a space." },
  { icon: FiShield, title: "Premium Quality", desc: "From lighting to acoustics, every detail is meticulously curated for peak performance." },
  { icon: FiZap, title: "Always Improving", desc: "Continuous feedback loops help us evolve with our members' ever-changing needs." },
];

const team = [
  { name: "Ariana Hossain", role: "Founder & CEO", initials: "AH", color: "bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800" },
  { name: "Rafid Chowdhury", role: "Head of Operations", initials: "RC", color: "bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800" },
  { name: "Nila Mahmud", role: "UX & Design Lead", initials: "NM", color: "bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800" },
];

const perks = [
  "Handpicked locations across the city",
  "Hourly & monthly flexible booking",
  "24/7 member support",
  "High-speed internet in every room",
  "Zero double-booking guarantee",
  "Instant confirmation system",
];

export default function AboutPage() {
  return (
    <main className="bg-white dark:bg-zinc-950 overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative bg-indigo-600 dark:bg-indigo-700 py-28 px-4 text-center">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="relative container mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            <FiBookOpen className="h-3.5 w-3.5" /> Our Story
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Built for Minds That{" "}
            <span className="text-indigo-200">Mean Business</span>
          </h1>
          <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            StudyNook was born from a simple frustration — finding a quiet,
            premium space to focus shouldn&apos;t be this hard. So we built it
            ourselves.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
        <div className="container mx-auto max-w-5xl px-4 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-1">
                {s.value}
              </p>
              <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="container mx-auto max-w-5xl px-4 py-20 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-widest uppercase mb-3 block">
            Our Mission
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-snug mb-6">
            Empowering Focus, <br /> One Room at a Time
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 leading-relaxed mb-8">
            We are on a mission to make premium, distraction-free study spaces
            accessible to every student and professional — no compromise on
            comfort, acoustics, or ambiance.
          </p>
          <ul className="space-y-3">
            {perks.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-slate-600 dark:text-zinc-300 text-sm"
              >
                <FiCheckCircle className="text-indigo-500 shrink-0 h-4 w-4" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual card */}
        <div className="relative">
          <div className="bg-indigo-50 dark:bg-zinc-800 rounded-2xl p-8 border border-indigo-100 dark:border-zinc-700 shadow-xl">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {["Quiet Zones", "Group Rooms", "Private Pods", "Lounge Areas"].map(
                (room, i) => (
                  <div
                    key={room}
                    className={`rounded-xl p-4 text-center font-semibold text-sm ${
                      i % 2 === 0
                        ? "bg-indigo-600 text-white"
                        : "bg-white dark:bg-zinc-700 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-600"
                    }`}
                  >
                    {room}
                  </div>
                )
              )}
            </div>
            <div className="bg-white dark:bg-zinc-700 rounded-xl p-4 border border-slate-200 dark:border-zinc-600 text-center">
              <p className="text-xs text-slate-400 dark:text-zinc-400 mb-1">
                Average Rating
              </p>
              <div className="flex justify-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className="h-4 w-4 text-amber-400"
                    style={{ fill: "currentColor" }}
                  />
                ))}
              </div>
              <p className="text-2xl font-extrabold text-slate-800 dark:text-white">
                4.9 / 5.0
              </p>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 w-28 h-28 bg-indigo-300 dark:bg-indigo-800 rounded-full blur-3xl opacity-50 pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-violet-300 dark:bg-violet-800 rounded-full blur-3xl opacity-40 pointer-events-none" />
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-slate-50 dark:bg-zinc-900 py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-widest uppercase mb-3 block">
              What We Stand For
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-slate-200 dark:border-zinc-700 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-all group"
              >
                <div className="bg-indigo-50 dark:bg-indigo-950/50 p-3 rounded-xl w-fit mb-4 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/60 transition-colors">
                  <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      {/* <section className="container mx-auto max-w-5xl px-4 py-20">
        <div className="text-center mb-12">
          <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-widest uppercase mb-3 block">
            The People
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            Meet Our Team
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {team.map(({ name, role, initials, color }) => (
            <div
              key={name}
              className="text-center group bg-slate-50 dark:bg-zinc-900 rounded-2xl p-8 border border-slate-200 dark:border-zinc-800 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
            >
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 ${color}`}
              >
                <span className="text-2xl font-extrabold">{initials}</span>
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-lg">
                {name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                {role}
              </p>
            </div>
          ))}
        </div>
      </section> */}

      {/* ── CTA ── */}
      <section className="bg-indigo-600 dark:bg-indigo-700 py-20 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          Ready to Find Your Focus?
        </h2>
        <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
          Browse our premium study spaces and book your perfect room today.
        </p>
        <Link
          href="/room"
          className="inline-block bg-white text-indigo-600 font-bold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
        >
          Explore Rooms
        </Link>
      </section>

    </main>
  );
}