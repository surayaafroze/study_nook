// app/rooms/page.tsx


import MyBookingsPage from './MyBookingsPage';


export const metadata = {
 title: "My Bookings | Track Your Study Room Reservations",
description:
  "Access all your study room bookings in one place. View reservation details, booking dates, payment status, and upcoming sessions.",
};

export default function MyBookings() {
  return <MyBookingsPage></MyBookingsPage>
}