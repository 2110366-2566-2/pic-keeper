"use client";
import { useErrorModal } from "@/hooks/useErrorModal";
import customerBookingService from "@/services/customerBooking";
import photographerBookingService from "@/services/photographerBooking";
import { Booking } from "@/types/booking";
import { useEffect, useState } from "react";
import BookingCard from "./BookingCard";
import BookingModal from "./BookingModal";
import Loading from "./Loading";
import { GetUserInfoResponse } from "@/types/response"; 

interface Content {
  bookingOptions:Booking;
  customer:GetUserInfoResponse;
  photographer:GetUserInfoResponse;
}

export default function BookingPage() {
  const showError = useErrorModal();
  const [bookingLists, setBookingLists] = useState<Booking[] | null>([]);
  const [allAppointment, setAllAppointment] = useState<Boolean>(true);
  const [upComing, setUpComing] = useState<Boolean>(false);
  const [past, setPast] = useState<Boolean>(false);
  const [cancel, setCancel] = useState<Boolean>(false);
  const [showContent, setShowContent] = useState(true);
  

  const refreshContent = (func: Function) => {
    setShowContent(false); // Set content to false
    setTimeout(async () => {
      let result = await func();
      setBookingLists(result);
      setShowContent(true); // Set content back to true after 2000 milliseconds
    }, 2000);
  };

  //-------Fetch Object will be replaced later--------------------------------------
  const getAllBookings = async () => {
    let resultCustomer: Array<Booking>;
    let resultPhotographer: Array<Booking>;

    try {
      const res = await customerBookingService.getAllBookings();
      if (res.data) {
        resultCustomer = res.data;
      } else {
        resultCustomer = [];
      }
    } catch (error) {
      showError(error, "Failed to fetch bookings");
      resultCustomer = [];
    }

    try {
      const res = await photographerBookingService.getMyBookings();
      if (res.data) {
        resultPhotographer = res.data;
      } else {
        resultPhotographer = [];
      }
    } catch (error) {
      resultPhotographer = [];
    }
    return [...resultCustomer, ...resultPhotographer];
  };

  const getPendingCancellations = async () => {
    let resultCustomer: Array<Booking>;
    let resultPhotographer: Array<Booking>;

    try {
      const res = await customerBookingService.getPendingCancellations();
      if (res.data) {
        resultCustomer = res.data;
      } else {
        resultCustomer = [];
      }
    } catch (error) {
      showError(error, "Failed to fetch bookings");
      resultCustomer = [];
    }

    try {
      const res = await photographerBookingService.getPendingCancellations();
      if (res.data) {
        resultPhotographer = res.data;
      } else {
        resultPhotographer = [];
      }
    } catch (error) {
      resultPhotographer = [];
    }
    return [...resultCustomer, ...resultPhotographer];
  };

  const getUpcomingBookings = async () => {
    let resultCustomer: Array<Booking>;
    let resultPhotographer: Array<Booking>;

    try {
      const res = await customerBookingService.getUpcomingBookings();
      if (res.data) {
        resultCustomer = res.data;
      } else {
        resultCustomer = [];
      }
    } catch (error) {
      showError(error, "Failed to fetch bookings");
      resultCustomer = [];
    }

    try {
      const res = await photographerBookingService.getUpcomingBookings();
      if (res.data) {
        resultPhotographer = res.data;
      } else {
        resultPhotographer = [];
      }
    } catch (error) {
      resultPhotographer = [];
    }
    return [...resultCustomer, ...resultPhotographer];
  };

  const getPastBookings = async () => {
    let resultCustomer: Array<Booking>;
    let resultPhotographer: Array<Booking>;

    try {
      const res = await customerBookingService.getPastBookings();
      if (res.data) {
        resultCustomer = res.data;
      } else {
        resultCustomer = [];
      }
    } catch (error) {
      showError(error, "Failed to fetch bookings");
      resultCustomer = [];
    }

    try {
      const res = await photographerBookingService.getPastBookings();
      if (res.data) {
        resultPhotographer = res.data;
      } else {
        resultPhotographer = [];
      }
    } catch (error) {
      resultPhotographer = [];
    }
    return [...resultCustomer, ...resultPhotographer];
  };

  //---Use Effect--------
  useEffect(() => {
    //Runs only on the first render
    setShowContent(false);
    refreshContent(getAllBookings);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    //Runs only on the dependency
  }, [bookingLists]);

  //-----------End--Fetch--------------------------------

  const [modalProps, setModalProps] = useState<Content|null>(null);

  //----------Modal--------------
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  //renderBooking Cards
  const renderedBookings = bookingLists?.map((booking, index) => {
    return (
      <BookingCard
        key={index}
        props={booking}
        openModal={openModal}
        setModalProps={setModalProps}
      />
    );
  });

  return (
    <div className="w-full h-screen px-16">
      <div className="flex flex-col h-full ">
        <div>
          <h2 className="text-3xl mt-8 pb-4 font-semibold">My Bookings</h2>
        </div>
        <div>
          <ul className="lg:flex text-gray-900 dark:text-white font-bold text-stone-500">
            <li>
              <div
                onClick={async () => {
                  setAllAppointment(true);
                  setUpComing(false);
                  setPast(false);
                  setCancel(false);
                  setShowContent(false);
                  refreshContent(getAllBookings);
                }}
                className="lg:me-16 ml-1"
              >
                {allAppointment ? (
                  <span className="underline text-amber-500">
                    All Appointments
                  </span>
                ) : (
                  <>All Appointments</>
                )}
              </div>
            </li>
            <li>
              <div
                onClick={async () => {
                  setAllAppointment(false);
                  setUpComing(true);
                  setPast(false);
                  setCancel(false);
                  refreshContent(getUpcomingBookings);
                }}
                className="lg:me-16 ml-1"
              >
                {upComing ? (
                  <span className="underline text-amber-500">Upcoming</span>
                ) : (
                  <>Upcoming</>
                )}
              </div>
            </li>
            <li>
              <div
                onClick={async () => {
                  setAllAppointment(false);
                  setUpComing(false);
                  setPast(true);
                  setCancel(false);
                  refreshContent(getPastBookings);
                }}
                className="lg:me-16 ml-1"
              >
                {past ? (
                  <span className="underline text-amber-500">Past</span>
                ) : (
                  <>Past</>
                )}
              </div>
            </li>
            <li>
              <div
                onClick={async () => {
                  setAllAppointment(false);
                  setUpComing(false);
                  setPast(false);
                  setCancel(true);
                  refreshContent(getPendingCancellations);
                }}
                className="lg:me-16 ml-1"
              >
                {cancel ? (
                  <span className="underline text-amber-500">
                    Cancellation Requested
                  </span>
                ) : (
                  <>Cancellation Requested</>
                )}
              </div>
            </li>
          </ul>
        </div>

        <div className="">
          <div className="bg-white mt-4 hidden lg:grid lg:grid-cols-10 gap-x-6 gap-y-3 py-3 font-medium text-sm text-zinc-500 rounded-lg w-full">
            <div className="pl-8 ">ID</div>
            <div className="col-span-2 pl-8 ">Gallery name</div>
            <div className="col-span-2 pl-8 ">Customer name</div>
            <div className="col-span-2 flex gap-x-2 pl-4 text-center">
              Appointment date
              <svg
                width="11"
                height="22"
                viewBox="0 0 11 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.5 8L0.73686 0.5L10.2631 0.5L5.5 8Z"
                  fill="#999590"
                />
              </svg>
            </div>
            <div className="pl-4 ">Price</div>
            <div className="col-span-2 pl-4 ">Status</div>
          </div>
        </div>

        <div
          className={`transition-opacity flex flex-col h-full overflow-y-auto py-4 ${
            showContent ? "opacity-100" : "opacity-0"
          }`}
        >
          {renderedBookings}
          <div className="mt-16"></div>
        </div>

        <Loading isOpen={!showContent}/>

        <BookingModal
          isOpen={modalIsOpen}
          closeModal={closeModal}
          content={modalProps as Content}
        />
      </div>
    </div>
  );
}
