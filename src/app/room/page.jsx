import RoomCard from '@/component/RoomCard';
import React from 'react';

const RoomPage =async () => {
   const res=await fetch('http://localhost:5000/addroom')
  const rooms=await res.json()
 console.log(rooms)
  return (
     <div className='max-w-7xl mx-auto pb-8'>
      <h1>All Destination</h1>
      <div className='grid grid-cols-3 gap-5'>
       {
        rooms.map(room=><RoomCard key={room._id} room={room}></RoomCard>)
       }
      </div>
    </div>
  );
};

export default RoomPage;