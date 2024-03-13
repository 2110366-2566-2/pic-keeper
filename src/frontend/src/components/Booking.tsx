'use client'
import { useState } from "react";
import BookingCard from "./BookingCard";
import BookingModal from "./BookingModal";

const BookingPage = () => {
  //-------Fetch Object--------------------------------------
  const listOfObjects: {
    id: string;
    name: string;
    customer: { name: string; imageUrl: string };
    date: string;
    price: string;
    status: number;
  }[] = [
    {
      id: "#B1201",
      name: "Object 1 Lorem ipsum dolor sit amet",
      customer: { name: "Baboom", imageUrl: "/images/signup.png" },
      date: "10/02/2024",
      price: "6,000",
      status: 0,
    },
    {
      id: "#B1202", // Corrected id value to make each object unique
      name: "Object 2 Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      customer: { name: "Baboom", imageUrl: "/images/no-picture.jpeg" },
      date: "10/02/2024",
      price: "6,000",
      status: 1,
    },
    {
      id: "#B1203", // Corrected id value to make each object unique
      name: "Object 3 Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      customer: { name: "Baboom", imageUrl: "/images/no-picture.jpeg" },
      date: "10/02/2024",
      price: "6,000",
      status: 2,
    },
    {
      id: "#B1201",
      name: "Object 1 Lorem ipsum dolor sit amet",
      customer: { name: "Baboom", imageUrl: "/images/signup.png" },
      date: "10/02/2024",
      price: "6,000",
      status: 0,
    }
  ];

  //-----------End--Fetch--------------------------------

  const [modalProps, setModalProps] = useState(null);

  //----------Modal--------------
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  //renderBooking Cards
  const renderedBookings = listOfObjects.map((obj) => {
    return (
      <>
        <BookingCard props={obj} openModal={openModal} setModalProps={setModalProps}/>
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
              <a
                href="#"
                className="lg:me-16 ml-1 hover:underline hover:text-amber-500"
              >
                All Appointments
              </a>
            </li>
            <li>
              <a
                href="#"
                className="lg:me-16 ml-1 hover:underline hover:text-amber-500"
              >
                Upcoming
              </a>
            </li>
            <li>
              <a
                href="#"
                className="lg:me-16 ml-1 hover:underline hover:text-amber-500"
              >
                Past
              </a>
            </li>
            <li>
              <a
                href="#"
                className="lg:me-16 ml-1 hover:underline hover:text-amber-500"
              >
                Cancellation Requested
              </a>
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
};

export default BookingPage;
//grid grid-cols-1 sm:grid-cols-6 gap-x-6 gap-y-3
//bg-white col-span-4"
//<svg fill="#71717a" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xml:space="preserve" width="64px" height="64px" transform="rotate(0)" stroke="#71717a" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:none;} </style> <path d="M6.5,8.5l6,7l6-7H6.5z"></path> <rect class="st0" width="24" height="24"></rect> <rect class="st0" width="24" height="24"></rect> </g></svg>
