import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import customerBookingService from "@/services/customerBooking";
import { useErrorModal } from "@/hooks/useErrorModal";

export default function Refund(props: {
  togglePage: Function;
  isOpen: boolean;
  bookingId: string;
  closeModal: Function;
  refreshTrigger: Function;
}) {
  const showError = useErrorModal();
  return (
    <Transition show={props.isOpen} as={Fragment}>
      <Transition.Child
        enter="transition-opacity ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="px-4 h-full overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-slate-300"
      >
        <div className="text-2xl font-semibold mt-8 mb-8">Request Refund</div>
        <div className="text-2xl font-semibold mt-8 mb-8">
          Please specify your reason
        </div>
        <div className="h-[200px] max-h-full ">
          <textarea
            name=""
            id="message"
            rows={10}
            className="w-full border-solid border-2 border-stone-300 rounded-md px-2"
          ></textarea>
          <div className="flex justify-center gap-x-8 ">
            <button
              className="modal mt-4 px-4 py-2 rounded font-semibold text-lg text-stone-500"
              onClick={() => {
                props.togglePage("INFO");
              }}
            >
              Cancel
            </button>
            <button
              className="mt-4 px-4 py-2 bg-orange-400 text-white rounded font-semibold text-lg"
              onClick={async () => {
                try {
                  props.togglePage("LOADING");
                  await customerBookingService.requestRefund(props.bookingId);
                  props.togglePage("COMPLETE");
                  props.refreshTrigger(true);
                  setTimeout(() => {
                    props.closeModal();
                  }, 1000);
                } catch (error) {
                  props.togglePage("INFO");
                  showError(error, "Cannot request refund.");
                }
              }}
            >
              Submit
            </button>
          </div>
          <div className="h-8"></div>
        </div>
      </Transition.Child>
    </Transition>
  );
}
