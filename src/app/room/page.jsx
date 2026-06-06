// app/rooms/page.tsx

import AllRoomPage from './AllRoomPage';


export const metadata = {
  title: 'All Study Rooms',
  description: 'Find and book the perfect study rooms with filters, amenities, and pricing.',
  keywords: ['study rooms', 'booking', 'quiet rooms', 'rooms near me'],
  openGraph: {
    title: 'All Study Rooms',
    description: 'Browse and filter study rooms easily.',
    type: 'website',
  },
};

export default function RoomPage() {
  return <AllRoomPage></AllRoomPage>
}