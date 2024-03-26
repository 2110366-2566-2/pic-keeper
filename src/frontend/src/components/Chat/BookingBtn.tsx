import { Booking, BookingStatus } from "@/types/booking";
import { Room } from "@/types/room";
import { useSession } from "next-auth/react";

interface Props {
  room: Room;
  booking: Booking | undefined;
}

const BookingBtn = ({ room, booking }: Props) => {
  const { data: session } = useSession();

  const handlePhotographerEditBooking = () => {};

  const handleCustomerBooking = () => {};

  if (room.gallery.photographer_id === session?.user.data?.id) {
    return (
      <div
        className="btn-primary self-center px-32 py-2"
        onClick={handlePhotographerEditBooking}
      >
        Edit
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="btn-primary bg-gray-300 cursor-default self-center px-32 py-2">
        Book
      </div>
    );
  }

  if (booking.status === BookingStatus.BookingDraftStatus) {
    return (
      <div
        className="btn-primary self-center px-32 py-2"
        onClick={handleCustomerBooking}
      >
        Book
      </div>
    );
  }
};

export default BookingBtn;
