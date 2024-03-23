"use client";
import customerBookingService from "@/services/customerBooking";
import photographerBookingService from "@/services/photographerBooking";
import { Booking, BookingStatus } from "@/types/booking";
import { useEffect, useState } from "react";
import BookingCard from "./BookingCard";
import BookingModal from "./BookingModal";
import { list } from "postcss";

const mockData: Booking = {
  id: "6ae48b2e-e6a3-43a0-8c69-cb677d56c257",
  customer_id: "3099fe61-ce94-4689-9553-45ef54ff511f",
  gallery: {
    id: "a0598881-cea7-48d0-90d0-ee7c0aa5fa27",
    photographer_id: "1ea3b074-61c4-4ca5-8e9a-0942f09111d8",
    location: "Chula",
    name: "Test Gallery",
    price: 6000,
    hours: 4,
    description: null,
    delivery_time: 10,
    included: [],
  },
  start_time: "2024-01-20T09:00:00Z",
  end_time: "2024-01-20T09:20:00Z",
  status: BookingStatus.BookingPaidOutStatus,
  created_at: "2024-03-22T13:04:18.277234Z",
  updated_at: "2024-03-22T13:04:18.277234Z",
};

export default function BookingPage() {
  //----------Instance Var------------

  const [bookingLists, setBookingLists] = useState<Booking[] | null>([]);
  const [allAppointment, setAllAppointment] = useState<Boolean>(true);
  const [upComing, setUpComing] = useState<Boolean>(false);
  const [past, setPast] = useState<Boolean>(false);
  const [cancel, setCancel] = useState<Boolean>(false);

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
    } catch (err) {
      resultCustomer = [];
    }

    try {
      const res = await photographerBookingService.getMyBookings();
      if (res.data) {
        resultPhotographer = res.data;
      } else {
        resultPhotographer = [];
      }
    } catch (err) {
      resultPhotographer = [];
    }
    console.log("Fetch Customer: ", resultCustomer);
    console.log("Fetch Photographer ", resultPhotographer);
    return [...resultCustomer, ...resultPhotographer];
    //return [mockData,mockData,mockData,mockData];
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
    } catch (err) {
      resultCustomer = [];
    }

    try {
      const res = await photographerBookingService.getPendingCancellations();
      if (res.data) {
        resultPhotographer = res.data;
      } else {
        resultPhotographer = [];
      }
    } catch (err) {
      resultPhotographer = [];
    }
    return [...resultCustomer, ...resultPhotographer];

    //return [mockData[5]];
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
    } catch (err) {
      resultCustomer = [];
    }

    try {
      const res = await photographerBookingService.getUpcomingBookings();
      if (res.data) {
        resultPhotographer = res.data;
      } else {
        resultPhotographer = [];
      }
    } catch (err) {
      resultPhotographer = [];
    }
    return [...resultCustomer, ...resultPhotographer];

    //return [mockData[1], mockData[2]];
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
    } catch (err) {
      resultCustomer = [];
    }

    try {
      const res = await photographerBookingService.getPastBookings();
      if (res.data) {
        resultPhotographer = res.data;
      } else {
        resultPhotographer = [];
      }
    } catch (err) {
      resultPhotographer = [];
    }
    return [...resultCustomer, ...resultPhotographer];

    //return [mockData[3], mockData[4]];
  };

  //---Use Effect--------
  useEffect(() => {
    //Runs only on the first render
    const initialFetch = async () => {
      const result = await getAllBookings();
      setBookingLists(result);
    };

    initialFetch();
  }, []);

  useEffect(() => {
    //Runs only on the dependency
  }, [bookingLists]);

  //-----------End--Fetch--------------------------------

  const [modalProps, setModalProps] = useState<Object>({});

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
      <div className="flex flex-col ">
        <div>
          <h2 className="text-3xl mt-8 pb-4 font-semibold">My Bookings</h2>
        </div>
        <div>
          <ul className="lg:flex  dark:text-white font-bold text-stone-500">
            <li>
              <div
                onClick={async () => {
                  setAllAppointment(true);
                  setUpComing(false);
                  setPast(false);
                  setCancel(false);
                  let result = await getAllBookings();
                  setBookingLists(result);
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
                  let result = await getUpcomingBookings();
                  setBookingLists(result);
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
                  let result = await getPastBookings();
                  setBookingLists(result);
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
                  let result = await getPendingCancellations();
                  setBookingLists(result);
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

        <div>{renderedBookings}</div>
        <BookingModal
          isOpen={modalIsOpen}
          closeModal={closeModal}
          content={modalProps}
        />
      </div>
    </div>
  );
}
