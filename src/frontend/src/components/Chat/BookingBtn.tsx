import { useModal } from "@/context/ModalContext";
import { useErrorModal } from "@/hooks/useErrorModal";
import { customerBookingService, paymentService, photographerBookingService } from "@/services";
import { Booking, BookingProposal, BookingStatus } from "@/types/booking";
import { Room } from "@/types/room";
import { useSession } from "next-auth/react";
import { useState } from "react";
import BookingForm from "./BookingForm";
import { Dialog } from "@headlessui/react";
import { parseISO, formatISO } from "date-fns";
import Link from "next/link";
import { PackageInfo } from "../Gallery";
import PackageSummary from "../Gallery/PackageSummary";
import Image from "next/image";

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

  const { openModal, closeModal } = useModal();

  const closeDraftModal = () => {
    setIsOpen(false);
  };

  const openDraftModal = () => {
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
          customer_id: room.other_users[0].id,
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
          closeDraftModal();
        } else {
          throw new Error("No response data returned");
        }
      } catch (error) {
        closeDraftModal();
        showError(error);
      }
    } else {
      showError(new Error("No user session"), "Error");
    }
  };
  const bookingId = "";

  const getPaymentQR = async (bookingId: string) => {
    try {
      const paymentQR = await paymentService.makeBookingPayment(bookingId);
      console.log("check here");
      console.log(paymentQR);
    } catch (error) {
      console.error("Error making booking payment:", error);
    }
  };  

  const handleCancelPayment = () => {
    closeModal();
  };

  const handleCompletePayment = () => {
    openModal(
      <div>
        <h2 className="my-5 text-2xl text-black">Payment Successful</h2>
        <div className="flex justify-end">
          <button className="btn-primary px-6" onClick={handleCancelPayment}>
            Done
          </button>
        </div>

      </div>

      , "Payment complete")
  };

  const handlePayment = () => {
    openModal(
      <div className="flex flex-col gap-4">
        <PackageSummary gallery={room.gallery} booking={booking} />
        <div className=" h-[1px] bg-black/30"></div>
        <div className="text-center text-gray-500 mt-6">
          Please scan QR code using<br />
          Mobile Banking Application
        </div>
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/640px-QR_code_for_mobile_English_Wikipedia.svg.png"
          alt="QR Code"
          width={400}
          height={400}
          className="w-[75%] h-auto mx-auto block"
        />

        {/* <Image
          src={await getPaymentQR() as string}
          alt="QR Code"
          width={400}
          height={400}
          className="w-[75%] h-auto mx-auto block"
        /> */}

        <div className="flex justify-center gap-2">
          <button className="btn-cancel px-2" onClick={handleCancelPayment}>
            Cancel
          </button>
          <button className="btn-primary px-6" onClick={handleCompletePayment}>
            Complete
          </button>
        </div>
      </div>,
      "Your package summary"
    );
  };

  const handleCancelBooking = () => {
    closeModal();
  };

  const handleCustomerBooking = () => {
    getPaymentQR(bookingId);
    openModal(
      <div>
        <PackageInfo gallery={room.gallery} booking={booking} />
        <div className="flex justify-end gap-2">
          <button className="btn-cancel px-2" onClick={handleCancelBooking}>
            Cancel
          </button>
          <button className="btn-primary px-6" onClick={handlePayment}>
            Pay
          </button>
        </div>
      </div>,
      "Confirm Your Package"
    );
  };

  if (room.gallery.photographer_id === session?.user.data?.id) {
    if (booking?.status === BookingStatus.BookingDraftStatus) {
      return (
        <Link
          href="/my-booking"
          className="btn-primary text-center self-center px-8"
        >
          View in my booking
        </Link>
      );
    }
    return (
      <>
        <button
          onClick={openDraftModal}
          className="btn-primary self-center px-32 py-2"
        >
          Draft
        </button>

        <Dialog
          open={isOpen}
          onClose={closeDraftModal}
          className="relative z-50"
        >
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
