import { BookingStatus } from "@/types/booking";
import customerBookingService from "@/services/customerBooking";
import photographerBookingService from "@/services/photographerBooking";
import { useRouter } from "next/navigation";
import { useErrorModal } from "@/hooks/useErrorModal";

export function RenderStatus(props: { status: BookingStatus }) {
  switch (props.status) {
    case BookingStatus.BookingCancelledStatus:
      return (
        <p className="text-base font-bold text-red-600">&bull; Cancelled </p>
      );
    case BookingStatus.BookingCompletedStatus:
      return (
        <p className="text-base font-bold text-amber-500">&bull; Completed </p>
      );
    case BookingStatus.BookingCustomerReqCancelStatus:
      return (
        <p className="text-base font-bold text-orange-500">
          &bull; Cancellation requested{" "}
        </p>
      );
    case BookingStatus.BookingPaidOutStatus:
      return (
        <p className="text-base font-bold text-blue-500">&bull; Paid out </p>
      );
    case BookingStatus.BookingPaidStatus:
      return (
        <p className="text-base font-bold text-emerald-500">
          &bull; User paid{" "}
        </p>
      );
    case BookingStatus.BookingPhotographerReqCancelStatus:
      return (
        <p className="text-base font-bold text-orange-500">
          &bull; Cancellation requested{" "}
        </p>
      );

    case BookingStatus.BookingRefundReqStatus:
      return (
        <p className="text-base font-bold text-orange-300">
          &bull; Refund requested{" "}
        </p>
      );

    default:
      return null; // Handle default case if needed
  }
}

export function RenderButtonByStatus(props: {
  status: BookingStatus;
  isOwner: boolean;
  togglePage: Function;
  bookingId: string;
  refreshTrigger: Function;
  closeModal: Function;
}) {
  const showError = useErrorModal();
  switch (props.status) {
    case BookingStatus.BookingPaidStatus:
      return props.isOwner ? (
        <div
          className="text-center mt-4 font-semibold text-red-500"
          onClick={async () => {
            try {
              props.togglePage("LOADING");
              await photographerBookingService.cancelBooking(props.bookingId);
              props.togglePage("COMPLETE");
              props.refreshTrigger(true);
              setTimeout(() => {
                props.closeModal();
              }, 1000);
            } catch (error) {
              props.togglePage("INFO");
              showError(error, "Cannot request cancel booking.");
            }
          }}
        >
          Request for cancellation
        </div>
      ) : (
        <div
          className="text-center mt-4 font-semibold text-red-500"
          onClick={async () => {
            try {
              props.togglePage("LOADING");
              await customerBookingService.cancelBooking(props.bookingId);
              props.togglePage("COMPLETE");
              props.refreshTrigger(true);
              setTimeout(() => {
                props.closeModal();
              }, 1000);
            } catch (error) {
              props.togglePage("INFO");
              showError(error, "Cannot request cancel booking.");
            }
          }}
        >
          Request for cancellation
        </div>
      );

    case BookingStatus.BookingPhotographerReqCancelStatus:
      return props.isOwner ? (
        <div className="text-center mt-4 font-semibold text-stone-400">
          Cancellation pending
        </div>
      ) : (
        <div
          className="text-center mt-4 font-semibold text-green-600"
          onClick={async () => {
            try {
              props.togglePage("LOADING");
              await customerBookingService.approveCancelBooking(
                props.bookingId
              );
              props.togglePage("COMPLETE");
              props.refreshTrigger(true);
              setTimeout(() => {
                props.closeModal();
              }, 1000);
            } catch (error) {
              props.togglePage("INFO");
              showError(error, "Cannot cancel booking.");
            }
          }}
        >
          Accept cancellation
        </div>
      );

    case BookingStatus.BookingCompletedStatus:
      return !props.isOwner ? (
        <div className="flex justify-center gap-x-4">
          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded font-semibold text-lg"
            onClick={() => {
              props.togglePage("REFUND");
            }}
          >
            Request refund
          </button>
          <button
            className="modal mt-4 px-4 py-2 bg-sky-950 text-white rounded font-semibold text-lg"
            onClick={() => {
              props.togglePage("FEED_BACK");
            }}
          >
            Give feedback
          </button>
        </div>
      ) : (
        <button
          className="mt-4 px-4 py-2 bg-sky-950 text-white rounded font-semibold text-lg"
          onClick={() => {
            props.togglePage("FEED_BACK");
          }}
        >
          View feedback
        </button>
      );

    case BookingStatus.BookingCustomerReqCancelStatus:
      return props.isOwner ? (
        <div
          className="text-center mt-4 font-semibold text-green-600"
          onClick={async () => {
            try {
              props.togglePage("LOADING");
              await photographerBookingService.approveCancel(props.bookingId);
              props.togglePage("COMPLETE");
              props.refreshTrigger(true);
              setTimeout(() => {
                props.closeModal();
              }, 1000);
            } catch (error) {
              props.togglePage("INFO");
              showError(error, "Cannot cancel booking.");
            }
          }}
        >
          Accept cancellation
        </div>
      ) : (
        <div className="text-center mt-4 font-semibold text-stone-400">
          Cancellation pending
        </div>
      );
    case BookingStatus.BookingPaidOutStatus:
      return props.isOwner ? (
        <button
          className="mt-4 px-4 py-2 bg-sky-950 text-white rounded font-semibold text-lg"
          onClick={() => {
            props.togglePage("FEED_BACK");
          }}
        >
          View feedback
        </button>
      ) : (
        <>
          <button
            className="modal mt-4 px-4 py-2 bg-sky-950 text-white rounded font-semibold text-lg"
            onClick={() => {
              props.togglePage("FEED_BACK");
            }}
          >
            Give feedback
          </button>
        </>
      );
    default:
      return null; // Handle default case if needed
  }
}
