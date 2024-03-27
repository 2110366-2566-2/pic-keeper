import { useModal } from "@/context/ModalContext";
import { useErrorModal } from "@/hooks/useErrorModal";
import { photographerBookingService } from "@/services";
import { Booking, BookingProposal, BookingStatus } from "@/types/booking";
import { Room } from "@/types/room";
import { useSession } from "next-auth/react";
import { useState } from "react";
import BookingForm from "./BookingForm";
import { Dialog } from "@headlessui/react";
import { parseISO, formatISO } from "date-fns";

interface Props {
  room: Room;
  booking: Booking | undefined;
  setBooking: React.Dispatch<React.SetStateAction<Booking | undefined>>;
}

const BookingBtn = ({ room, booking, setBooking }: Props) => {
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

  const handlePhotographerSaveBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (session?.user.data) {
      try {
        // Parse startTime and endTime to Date objects
        const parsedStartTime = parseISO(startTime);
        const parsedEndTime = parseISO(endTime);

        // Convert Date objects to strings in ISO format
        const isoStartTime = formatISO(parsedStartTime);
        const isoEndTime = formatISO(parsedEndTime);
        const newBooking: BookingProposal = {
          customer_id: session?.user.data?.id,
          room_id: room.id,
          negotiated_price: negotiatedPrice,
          start_time: isoStartTime,
          end_time: isoEndTime,
        };
        const response = await photographerBookingService.createBooking(
          newBooking
        );
        if (response.data) {
          setBooking(response.data);
          closeModal();
          console.log("1");
        } else {
          console.log("2");
          throw new Error("No response data returned");
        }
      } catch (error) {
        closeModal();
        showError(error);
      }
    } else {
      showError(new Error("No user session"), "Error");
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
