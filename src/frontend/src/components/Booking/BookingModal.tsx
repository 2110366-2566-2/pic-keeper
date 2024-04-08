"use client";
import { BookingStatus, Booking } from "@/types/booking";
import { GetUserInfoResponse } from "@/types/response";
import { transformDate } from "@/utils/date";
import { Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { Fragment } from "react";
import { RenderStatus, RenderButtonByStatus } from "./RenderBySatus";
import { useState, useEffect } from "react";
import FeedBack from "./FeedBack";
import Refund from "./Refund";
import Info from "./Info";
import Loading from "./Loading";
import Complete from "./Complete";

enum ModalPage {
  Info = "INFO",
  FeedBack = "FEED_BACK",
  Refund = "REFUND",
  Loading = "LOADING",
  Complete= "COMPLETE"
}

interface Content {
  bookingOptions: Booking;
  customer: GetUserInfoResponse;
  photographer: GetUserInfoResponse;
}

export default function BookingModal(props: {
  isOpen: boolean;
  closeModal: Function;
  content: Content;
  refreshTrigger: Function;
}) {
  const [page, togglePage] = useState<ModalPage>(ModalPage.Info);
  const session = useSession();
  const isPackageOwner = () => {
    return (
      props.content.bookingOptions.room.gallery.photographer_id ===
      session.data?.user.data?.id
    );
  };

  const handleOutsideClick = (event: any) => {
    // Close modals if the click occurred outside of them
    if (!event.target.closest(".modal") && props.isOpen) {
      document.removeEventListener("click", handleOutsideClick);
      props.closeModal();
      setTimeout(() => {
        togglePage(ModalPage.Info);
      }, 200);
    }
  };

  const handleAutoClose = () => {
    document.removeEventListener("click", handleOutsideClick);
    props.closeModal();
    setTimeout(() => {
      togglePage(ModalPage.Info);
    }, 200);
  };

  useEffect(() => {
    if(props.isOpen){
        document.addEventListener("click", handleOutsideClick);
       //This listener will call the handleOutsideClick function whenever a click event occurs anywhere on the document.
    }
  }, [props.isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!props.content) {
    return <></>;
  }

  return (
    <>
      <Transition show={props.isOpen as boolean} as={Fragment}>
        <Transition.Child
          enter="transition-opacity ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute bg-black bg-opacity-50 inset-0 flex items-center justify-center ">
            <div
              className={`mb-16 modal max-w-md w-full max-h-full h-[500px] px-4 bg-white shadow-lg rounded-2xl overflow-hidden`}
            >
              {
                <Info
                  content={props.content}
                  isPackageOwner={isPackageOwner()}
                  togglePage={togglePage}
                  isOpen={page == ModalPage.Info}
                  refreshTrigger={props.refreshTrigger}
                  closeModal={handleAutoClose}
                  renderButton={true}
                  addElement={null}
                />
              }

              {
                <FeedBack
                  togglePage={togglePage}
                  isOwner={isPackageOwner()}
                  isOpen={page == ModalPage.FeedBack}
                  feedBackContent={null}
                  booking_id={props.content.bookingOptions.id}
                  refreshTrigger={props.refreshTrigger}
                  closeModal={handleAutoClose}
                />
              }

              {
                <Refund
                  togglePage={togglePage}
                  isOpen={page == ModalPage.Refund}
                  bookingId={props.content.bookingOptions.id}
                  refreshTrigger={props.refreshTrigger}
                  closeModal={handleAutoClose}
                />
              }

              { page== ModalPage.Loading &&   //prevent overlap transition
                <Loading
                  isOpen={page == ModalPage.Loading}
                  content="In proccess..."
                />
              }

              {
                <Complete isOpen={page== ModalPage.Complete} content="Completed!"/>
              }
            </div>
          </div>
        </Transition.Child>
      </Transition>
    </>
  );
}
