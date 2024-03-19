"use client";
import customerBookingService from "@/services/customerBooking";
import { Booking, BookingStatus } from "@/types/booking";
import { useEffect, useState } from "react";
import BookingCard from "./BookingCard";
import BookingModal from "./BookingModal";




interface BookingTmp {
  id: string;
  customer_id:string;
  gallery_id: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

const mockData: Booking[] = [
  {
    id: "#B1201",
    customer_id:"string",
    gallery_id: "string",
    start_time: "10/02/2024",
    end_time: "string",
    created_at: "string",
    updated_at: "string",
    status: BookingStatus.BookingCancelledStatus,
  },
  {
    id: "#B1201",
    customer_id:"string",
    gallery_id: "string",
    start_time: "10/02/2024",
    end_time: "string",
    created_at: "string",
    updated_at: "string",
    status: BookingStatus.BookingPaidStatus,
  },
  {
    id: "#B1201",
    customer_id:"string",
    gallery_id: "string",
    start_time: "10/02/2024",
    end_time: "string",
    created_at: "string",
    updated_at: "string",
    status: BookingStatus.BookingPaidStatus,
  },
  {
    id: "#B1201",
    customer_id:"string",
    gallery_id: "string",
    start_time: "10/02/2024",
    end_time: "string",
    created_at: "string",
    updated_at: "string",
    status: BookingStatus.BookingPaidOutStatus,
  },
  {
    id: "#B1201",
    customer_id:"string",
    gallery_id: "string",
    start_time: "10/02/2024",
    end_time: "string",
    created_at: "string",
    updated_at: "string",
    status: BookingStatus.BookingCompletedStatus,
  },
  {
    id: "#B1201",
    customer_id:"string",
    gallery_id: "string",
    start_time: "10/02/2024",
    end_time: "string",
    created_at: "string",
    updated_at: "string",
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
    const result= await customerBookingService.getAllBookings();
    console.log("Fetch complete: ",result);
    //return result.data
    return mockData;
  };
  const getPendingCancellations = async () => {
    const result= await customerBookingService.getPendingCancellations();
    console.log("Fetch pending complete: ",result);
    //return result.data
    return [mockData[5]];
  };
  const getUpcomingBookings = async () => {
    const result= await customerBookingService.getUpcomingBookings();
    console.log("Fetch coming complete: ",result);
    //return result.data
    return [mockData[1], mockData[2]];
  };
  const getPastBookings = async () => {
    const result= await customerBookingService.getPastBookings();
    console.log("Fetch Past complete: ",result);
    //return result.data
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
  const renderedBookings = bookingLists.map((booking,index) => {
    
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

