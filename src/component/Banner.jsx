import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FiCheckCircle, FiClock, FiSearch, FiShield, FiStar, FiZap } from 'react-icons/fi';
import RoomCard from './RoomCard';

const Banner =async () => {
   const res = await fetch("http://localhost:5000/addroom");
  const rooms = await res.json();
 const topRooms= rooms.slice(0,4)
  // console.log(rooms);

  return (
    <div>
       <div className=' bg-slate-50 dark:bg-zinc-900/40'>
        <section className="relative overflow-hidden py-20 lg:py-32 md:px-5 px-3">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0  bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
              Find Your Perfect <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400">
                Study Room
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-zinc-400 leading-relaxed">
              Browse and book quiet, private study rooms in your library. List your own room and earn. Focus on what matters most in a distraction-free environment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link 
                href="/rooms" 
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                Explore Rooms
              </Link>
              <Link 
                href="/add-room" 
                className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all duration-300"
              >
                List Your Space
              </Link>
            </div>
          </div>
        </div>
      </section>
       </div>


  <section>
        <div className='max-w-7xl mx-auto pb-8'>
      <h1>All Destination</h1>
      <div className='grid grid-cols-3 gap-5'>
       {
        topRooms.map(room=><RoomCard key={room._id} room={room}></RoomCard>)
       }
      </div>
    </div>
      </section>




      <section className="py-20 bg-slate-50/50 dark:bg-zinc-900/30 border-y border-slate-200 dark:border-zinc-800 ">
        <div className="container mx-auto px-4 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto">Booking your ideal study space is quick, easy, and hassle-free. Follow these simple steps.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600 dark:text-indigo-400">
                <FiSearch className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Find a Room</h3>
              <p className="text-slate-500 dark:text-zinc-400">Browse through our diverse selection of study rooms based on amenities, capacity, and rate.</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600 dark:text-indigo-400">
                <FiClock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Choose Time</h3>
              <p className="text-slate-500 dark:text-zinc-400">Select your preferred date and time slot. Our smart system prevents any double-booking conflicts.</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600 dark:text-indigo-400">
                <FiCheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Book & Study</h3>
              <p className="text-slate-500 dark:text-zinc-400">Confirm your booking instantly and arrive at your dedicated space ready to focus and achieve.</p>
            </div>
          </div>
        </div>
      </section>



    



       <section className="py-20 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why students and professionals choose StudyNook</h2>
              <p className="text-lg text-slate-500 dark:text-zinc-400 mb-8">
                We provide the perfect environment for deep work and collaboration. Our platform ensures you always have access to the right space when you need it.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 mt-1">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <FiZap className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Instant Confirmation</h4>
                    <p className="text-slate-500 dark:text-zinc-400">No waiting for approvals. Your booking is confirmed the moment you complete it.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 mt-1">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <FiShield className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Guaranteed Availability</h4>
                    <p className="text-slate-500 dark:text-zinc-400">Our strict conflict-check system guarantees your room will be ready and waiting for you.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 mt-1">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <FiStar className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Premium Amenities</h4>
                    <p className="text-slate-500 dark:text-zinc-400">From high-speed Wi-Fi to interactive whiteboards, our rooms are fully equipped for success.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl transform rotate-3 scale-105 opacity-20 blur-xl"></div>
              <Image
  src="/banner.avif"
  alt="Modern study space"
  width={700}
  height={500}
  className="relative rounded-2xl shadow-2xl object-cover h-[500px] w-full">
   </Image>           
      </div>
          </div>
        </div>
      </section>
    </div>         
 );
};

export default Banner;
              


          
 