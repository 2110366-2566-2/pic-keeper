"use client";
import { useState, useEffect } from "react";
import BookingCard from "./BookingCard";
import BookingModal from "./BookingModal";
import { Booking, BookingStatus } from "@/types";

interface BookingTmp {
  id: string;
  name: string;
  customer: { name: string; imageUrl: string };
  date: string;
  price: string;
  status: BookingStatus;
}

const mockData: BookingTmp[] = [
  {
    id: "#B1201",
    name: "Object 1 Lorem ipsum dolor sit amet",
    customer: { name: "Baboom", imageUrl: "/images/signup.png" },
    date: "10/02/2024",
    price: "6,000",
    status: BookingStatus.BookingCancelledStatus,
  },
  {
    id: "#B1201",
    name: "Object 1 Lorem ipsum dolor sit amet",
    customer: { name: "Baboom", imageUrl: "/images/signup.png" },
    date: "10/02/2024",
    price: "6,000",
    status: BookingStatus.BookingPaidStatus,
  },
  {
    id: "#B1201",
    name: "Object 1 Lorem ipsum dolor sit amet",
    customer: { name: "Baboom", imageUrl: "/images/signup.png" },
    date: "10/02/2024",
    price: "6,000",
    status: BookingStatus.BookingPaidStatus,
  },
  {
    id: "#B1202", // Corrected id value to make each object unique
    name: "Object 2 Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    customer: { name: "Baboom", imageUrl: "/images/no-picture.jpeg" },
    date: "10/02/2024",
    price: "6,000",
    status: BookingStatus.BookingPaidOutStatus,
  },
  {
    id: "#B1203", // Corrected id value to make each object unique
    name: "Object 3 Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    customer: { name: "Baboom", imageUrl: "/images/no-picture.jpeg" },
    date: "10/02/2024",
    price: "6,000",
    status: BookingStatus.BookingCompletedStatus,
  },
  {
    id: "#B1201",
    name: "Object 1 Lorem ipsum dolor sit amet",
    customer: { name: "Baboom", imageUrl: "/images/signup.png" },
    date: "10/02/2024",
    price: "6,000",
    status: BookingStatus.BookingCustomerReqCancelStatus,
  },
];

export default function BookingPage() {
  //----------Instance Var------------

  const [bookingLists, setBookingLists] = useState<BookingTmp[]>([]);
  const [allAppointment, setAllAppointment] = useState<Boolean>(true);
  const [upComing, setUpComing] = useState<Boolean>(false);
  const [past, setPast] = useState<Boolean>(false);
  const [cancel, setCancel] = useState<Boolean>(false);

  //-------Fetch Object will be replaced later--------------------------------------
  const getAllBookings = async () => {
    return mockData;
  };
  const getPendingCancellations = async () => {
    return [mockData[5]];
  };
  const getUpcomingBookings = async () => {
    return [mockData[1], mockData[2]];
  };
  const getPastBookings = async () => {
    return [mockData[3], mockData[4]];
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

  const [modalProps, setModalProps] = useState({});

  //----------Modal--------------
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  //renderBooking Cards
  const renderedBookings = bookingLists.map((obj) => {
    return (
      <>
        <BookingCard
          props={obj}
          openModal={openModal}
          setModalProps={setModalProps}
        />
      </>
    );
  });

  return (
    <div className="w-full h-screen px-16 z-1">
      <div className="flex flex-col ">
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

//grid grid-cols-1 sm:grid-cols-6 gap-x-6 gap-y-3
//bg-white col-span-4"
//<svg fill="#71717a" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xml:space="preserve" width="64px" height="64px" transform="rotate(0)" stroke="#71717a" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:none;} </style> <path d="M6.5,8.5l6,7l6-7H6.5z"></path> <rect class="st0" width="24" height="24"></rect> <rect class="st0" width="24" height="24"></rect> </g></svg>
