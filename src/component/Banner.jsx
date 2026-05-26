import { Suspense } from 'react';
import BannerClient from './BannerClient';

const Banner = async () => {
  let rooms = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room/latest`, {
      cache: 'no-store',
    });
    if (res.ok) {
      rooms = await res.json();
    }
  } catch (err) {
    console.error('Could not fetch latest rooms:', err.message);
  }

  return <BannerClient rooms={rooms} />;
};

export default Banner;