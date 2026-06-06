// app/rooms/page.tsx

import AddRoomPage from './AddRoomPage';



export const metadata = {
  title: "Add Study Room | List Your Space for Daily Bookings",
description:
  "Create a new study room listing with amenities, pricing, availability, and location details. Start accepting daily bookings from students and professionals.",
};

export default function AddRoom() {
  return <AddRoomPage></AddRoomPage>
}