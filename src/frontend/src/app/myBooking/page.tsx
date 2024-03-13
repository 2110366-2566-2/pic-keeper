'use client'
import BookingPage from "@/components/Booking";
import bookingService from "@/services/booking";
import photographerGalleryService from "@/services/photographerGalleries"

const Home = () => {

  return (
    <div className="max-w-full m-auto bg-zinc-50">
      <BookingPage />
    </div>
  );
};

export default Home;
