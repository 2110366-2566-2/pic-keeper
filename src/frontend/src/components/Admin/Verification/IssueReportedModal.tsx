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
import { adminService } from "@/services";
import { useRouter } from "next/navigation";

interface Props {
  issue: Issue;
  handleRefundAction: Function;
  handleRejectAction: Function;
}
enum Status {
  Refund = "REFUND",
}

const IssueReportedModal = ({
  issue,
  handleRefundAction,
  handleRejectAction,
}: Props) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [bookingTarget, setBookingTarget] = useState<Booking | null>(null);
  const router = useRouter();

  const handleOutsideClick = (event: any) => {
    // Close modals if the click occurred outside of them
    if (!event.target.closest(".modal") && isOpen) {
      document.removeEventListener("click", handleOutsideClick);
      setOpen(false);
    }
  };

  const getBookingRefund = async (id: string) => {
    const response = await adminService.listPendingRefundBookings();
    if (response.data) {
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].id == id) {
          setBookingTarget(response.data[i]);
          break;
        }
      }
    }
  };
  const handleClickChat = () => {
    // Navigate to the specified URL
    router.push(`/chat/${issue.booking?.room.id}`);
  };

  useEffect(() => {
    if (issue.subject == Status.Refund && issue.status == "OPEN") {
      getBookingRefund(issue.booking?.id as string);
      console.log("ISSSS", issue);
    }
  }, [issue]); // eslint-disable-line react-hooks/exhaustive-deps

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
                  issue.subject == Status.Refund && issue.status == "OPEN"
                    ? "max-w-[700px] grid-cols-2"
                    : "max-w-md grid-cols-1"
                } bg-white  w-full max-h-full h-[500px] gap-x-4 rounded-2xl`}
              >
                <div className="flex flex-col space-y-3 col-span-1 p-8">
                  <div className="flex flex-row space-x-3">
                    <h2 className="text-stone-400">#{issue.id.slice(0, 5)}</h2>
                    <div className="text-green-500">{issue.status}</div>
                  </div>
                  <p className="text-lg font-bold">{`${capitalizeFirstLetter(
                    issue.subject
                  )} request`}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="">Reporter</div>
                    <div className="">
                      <div className="">{issue.reporter.email}</div>
                      {issue.reporter.name ? (
                        <div className="text-gray-400">
                          {issue.reporter.name}
                        </div>
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
                      onClick={async () => {
                        await handleRefundAction(issue.id);
                        document.removeEventListener("click", handleOutsideClick);
                        setOpen(false);
                      }}
                      className="bg-amber-500 text-white rounded-md p-2"
                    >
                      Refund
                    </button>
                    <button
                      onClick={async () => {
                        await handleRejectAction(issue.id);
                        document.removeEventListener("click", handleOutsideClick);
                        setOpen(false);
                      }}
                      className="bg-red-600 text-white rounded-md p-2"
                    >
                      Reject
                    </button>
                  </div>
                </div>
                <div className="overflow-hidden">
                  {issue.subject == Status.Refund && issue.status == "OPEN" && (
                    <Info
                      content={{ bookingOptions: bookingTarget as Booking }}
                      isOpen={true}
                      closeModal={() => {}}
                      isPackageOwner={false}
                      refreshTrigger={() => {}}
                      togglePage={() => {}}
                      renderButton={false}
                      addElement={null}
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
