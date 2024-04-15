"use client";
import { ReactNode, useState } from "react";
import { useModal } from "@/context/ModalContext";
import { useErrorModal } from "@/hooks/useErrorModal";
import { Issue } from "@/types/issue";
import { capitalizeFirstLetter } from "@/utils/string";
import { format } from "date-fns";
import Info from "@/components/Booking/Info";
import { Booking } from "@/types/booking";
import { BookingStatus } from "@/types/booking";
import { useEffect } from "react";
import { Transition } from "@headlessui/react";
import { Fragment } from "react";

interface Props {
  issue: Issue;
  handleRefundAction: Function;
  handleRejectAction: Function;
}
enum Status {
  Refund = "REFUND",
}

const booking: Booking = {
  id: "bfd857f3-ea25-4f81-a479-bee5aa326cb4",
  customer_id: "06759d78-fd5c-4043-9487-563e7854d12f",
  room: {
    id: "cbeb8821-fac2-4379-a7af-6b229614dbb0",
    gallery: {
      id: "04a1d690-5a58-4055-b6ef-680642810a20",
      photographer_id: "38ff5841-8665-4859-b973-b215c6cf0062",
      location: "Chula",
      name: "Test Gallery",
      avg_rating: 0,
      price: 6000,
      hours: 4,
      description: "null",
      delivery_time: 10,
      included: ["100 photos", "Free bonus"],
    },
    created_at: "2024-04-02T20:32:06.562667Z",
    updated_at: "2024-04-02T20:32:06.562667Z",
    deleted_at: "null",
    other_users: [],
  },
  resulted_price: 6000,
  start_time: "2024-04-10T06:19:00Z",
  end_time: "2024-04-18T06:19:00Z",
  status: BookingStatus.BookingCompletedStatus,
  created_at: "2024-04-08T06:19:40.667618Z",
  updated_at: "2024-04-08T06:19:40.667618Z",
};

const IssueReportedModal = ({
  issue,
  handleRefundAction,
  handleRejectAction,
}: Props) => {

  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOutsideClick = (event: any) => {
    // Close modals if the click occurred outside of them
    if (!event.target.closest(".modal") && isOpen) {
      document.removeEventListener("click", handleOutsideClick);
      setOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
      //This listener will call the handleOutsideClick function whenever a click event occurs anywhere on the document.
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <>
      <div className="modal">
        <button
          onClick={() => {
            setOpen(true);
          }}
        >
          ...
        </button>
      </div>

      {
        <Transition show={isOpen} as={Fragment}>
        <Transition.Child
          enter="transition-opacity ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
        <div className="fixed flex inset-0 justify-center items-center bg-black bg-opacity-50">
          <div
            className={`grid modal ${
              issue.subject == Status.Refund ? "max-w-[700px] grid-cols-2" : "max-w-md grid-cols-1"
            } bg-white  w-full max-h-full h-[500px] gap-x-4 rounded-2xl`}
          >
            <div className="flex flex-col space-y-3 col-span-1 p-8">
              <div className="flex flex-row space-x-3">
                <h2 className="text-stone-400">#{issue.id.slice(0, 5)}</h2>
                <div className="text-green-500">OPEN</div>
              </div>
              <p className="text-lg font-bold">{`${capitalizeFirstLetter(
                issue.subject
              )} request`}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="">Reporter</div>
                <div className="">
                  <div className="">{issue.reporter.email}</div>
                  {issue.reporter.name ? (
                    <div className="text-gray-400">{issue.reporter.name}</div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="">Created date</div>
                <div className="">
                  {format(issue.created_at, "MMMM do, yyyy H:mma") || "N/A"}
                </div>
                <div className="">Due date</div>
                <div className="">
                  {format(issue.due_date, "MMMM do, yyyy H:mma") || "N/A"}
                </div>
              </div>
              <div className="">Details</div>
              <div className="rounded-md ring ring-slate-600 h-full">
                <article className="m-4">{issue.description}</article>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    handleRefundAction(issue.id);
                  }}
                  className="bg-amber-500 text-white rounded-md p-2"
                >
                  Refund
                </button>
                <button
                  onClick={() => {
                    handleRejectAction(issue.id);
                  }}
                  className="bg-red-600 text-white rounded-md p-2"
                >
                  Reject
                </button>
              </div>
            </div>
            <div className="overflow-hidden">
              {issue.subject == Status.Refund && (
                <Info
                  content={{ bookingOptions: booking }}
                  isOpen={true}
                  closeModal={() => {}}
                  isPackageOwner={false}
                  refreshTrigger={() => {}}
                  togglePage={() => {}}
                  renderButton={false}
                  addElement={
                    <button
                      className="mt-4 modal px-4 py-2 bg-orange-400 text-white rounded font-semibold text-lg"
                      onClick={() => {}}
                    >
                      BakHam Chat
                    </button>
                  }
                />
              )}
            </div>
          </div>
        </div>
        </Transition.Child>
      </Transition>
        
      }
    </>
  );
};

export default IssueReportedModal;
