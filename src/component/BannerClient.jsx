'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FiCheckCircle, FiClock, FiSearch, FiShield, FiStar, FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';
import RoomCard from './RoomCard';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const BannerClient = ({ rooms }) => {
  return (
    <div>

      {/* ── Hero Banner ── */}
      <div className="bg-slate-50 dark:bg-zinc-900/40">
        <section className="relative overflow-hidden py-20 lg:py-32 md:px-5 px-3">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0}
                className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50"
              >
                Find Your Perfect <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400">
                  Study Room
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
                className="text-lg md:text-xl text-slate-600 dark:text-zinc-400 leading-relaxed"
              >
                Browse and book quiet, private study rooms in your library. List your own room and earn. Focus on what matters most in a distraction-free environment.
              </motion.p>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
              >
                <Link
                  href="/room"
                  className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300"
                >
                  Explore Rooms
                </Link>
                <Link
                  href="/addrooms"
                  className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all duration-300"
                >
                  List Your Space
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Latest Rooms Section ── */}
      <section className="py-16 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Available Study Rooms</h2>
            <p className="text-slate-500 dark:text-zinc-400 mt-2 text-sm">
              Browse our latest listings and find a space that suits you
            </p>
          </motion.div>

          {rooms.length === 0 ? (
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center py-16"
            >
              <p className="text-slate-400 dark:text-zinc-500 text-sm">No rooms available right now. Check back soon!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rooms.map((room, i) => (
                <motion.div
                  key={room._id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.5}
                >
                  <RoomCard room={room} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link
              href="/room"
              className="inline-block px-6 py-3 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition"
            >
              View All Rooms →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 bg-slate-50/50 dark:bg-zinc-900/30 border-y border-slate-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 text-slate-800 dark:text-white">How It Works</h2>
            <p className="text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto">
              Booking your ideal study space is quick, easy, and hassle-free.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiSearch className="h-8 w-8" />,
                title: '1. Find a Room',
                desc: 'Browse our diverse selection of study rooms based on amenities, capacity, and rate.',
              },
              {
                icon: <FiClock className="h-8 w-8" />,
                title: '2. Choose Time',
                desc: 'Select your preferred date and time slot. Our smart system prevents any double-booking conflicts.',
              },
              {
                icon: <FiCheckCircle className="h-8 w-8" />,
                title: '3. Book & Study',
                desc: 'Confirm your booking instantly and arrive at your dedicated space ready to focus and achieve.',
              },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm text-center hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600 dark:text-indigo-400">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-white">{step.title}</h3>
                <p className="text-slate-500 dark:text-zinc-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why StudyNook ── */}
      <section className="py-20 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800 dark:text-white">
                Why students and professionals choose StudyNook
              </h2>
              <p className="text-lg text-slate-500 dark:text-zinc-400 mb-8">
                We provide the perfect environment for deep work and collaboration. Our platform ensures you always have access to the right space when you need it.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: <FiZap className="h-5 w-5" />,
                    title: 'Instant Confirmation',
                    desc: 'No waiting for approvals. Your booking is confirmed the moment you complete it.',
                  },
                  {
                    icon: <FiShield className="h-5 w-5" />,
                    title: 'Guaranteed Availability',
                    desc: 'Our strict conflict-check system guarantees your room will be ready and waiting for you.',
                  },
                  {
                    icon: <FiStar className="h-5 w-5" />,
                    title: 'Premium Amenities',
                    desc: 'From high-speed Wi-Fi to interactive whiteboards, our rooms are fully equipped for success.',
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    className="flex gap-4"
                  >
                    <div className="shrink-0 mt-1">
                      <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        {item.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">{item.title}</h4>
                      <p className="text-slate-500 dark:text-zinc-400">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-linear-to-tr from-indigo-600 to-blue-500 rounded-2xl transform rotate-3 scale-105 opacity-20 blur-xl" />
              <Image
                src="/banner.avif"
                alt="Modern study space"
                width={700}
                height={500}
                className="relative rounded-2xl shadow-2xl object-cover h-125 w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default BannerClient;