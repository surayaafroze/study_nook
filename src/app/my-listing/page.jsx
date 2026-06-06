// app/rooms/page.tsx


import MyListingsPage from './MyListingsPage';


export const metadata = {
 title: "My Study Room Listings | Manage Your Spaces",
description:
  "View and manage all your study room listings. Update room details, pricing, amenities, and availability from your dashboard.",
};

export default function MyListings() {
  return <MyListingsPage></MyListingsPage>
}