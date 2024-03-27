import { useModal } from "@/context/ModalContext";
import { useErrorModal } from "@/hooks/useErrorModal";
import { photographerBookingService } from "@/services";
import { Booking, BookingStatus } from "@/types/booking";
import { Room } from "@/types/room";
import { useSession } from "next-auth/react";
import { useState } from "react";
import BookingForm from "./BookingForm";
import { Dialog } from "@headlessui/react";

interface Props {
  room: Room;
  booking: Booking | undefined;
}

const BookingBtn = ({ room, booking }: Props) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const showError = useErrorModal();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [negotiatedPrice, setNegotiatedPrice] = useState<number>(
    room.gallery.price
  );

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handlePhotographerSaveBooking = async () => {
    try {
      // TODO: Implement this kub
      // const response = await photographerBookingService.createBooking({Your booking proposal});
      closeModal();
    } catch (error) {
      showError(error);
    }
  };

  // TODO: Here
  const handleCustomerBooking = () => {};

  if (room.gallery.photographer_id === session?.user.data?.id) {
    return (
      <>
        <button
          onClick={openModal}
          className="btn-primary self-center px-32 py-2"
        >
          {room.gallery.photographer_id === session?.user.data?.id
            ? "Edit"
            : "Book"}
        </button>

        <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
              <Dialog.Title>Edit package</Dialog.Title>
              <BookingForm
                negotiatedPrice={negotiatedPrice}
                setNegotiatedPrice={setNegotiatedPrice}
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
                onSave={handlePhotographerSaveBooking}
              />
            </Dialog.Panel>
          </div>
        </Dialog>
      </>
    );
  }

  if (!booking) {
    return (
      <button className="btn-primary bg-gray-300 cursor-default self-center px-32 py-2">
        Book
      </button>
    );
  }

  if (booking.status === BookingStatus.BookingDraftStatus) {
    return (
      <button
        className="btn-primary self-center px-32 py-2"
        onClick={handleCustomerBooking}
      >
        Book
      </button>
    );
  }
};

export default BookingBtn;
