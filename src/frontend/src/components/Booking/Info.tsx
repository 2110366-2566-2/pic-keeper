"use client";
import { BookingStatus, Booking } from "@/types/booking";
import { transformDate } from "@/utils/date";
import { Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { Fragment } from "react";
import { RenderStatus, RenderButtonByStatus } from "./RenderBySatus";
import { useState, useEffect } from "react";
import { GetUserInfoResponse } from "@/types/response";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Content {
  bookingOptions: Booking;
  customer: GetUserInfoResponse;
  photographer: GetUserInfoResponse;
}

export default function Info(props: {
  content: Content;
  isPackageOwner: boolean;
  togglePage: Function;
  isOpen: boolean;
}) {
  const router = useRouter();

  const handleClickChat = () => {
    // Navigate to the specified URL
    router.push(`/chat/${props.content.bookingOptions.room.id}`)
  };

  const renderDetail = props.content.bookingOptions.room.gallery.included?.map(
    (detail, index) => {
      return (
        <div className="flex gap-x-2 text-sm font-semibold text-stone-500" key={index}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
            </g>
          </svg>
          {detail}
        </div>
      );
    }
  );

  return (
    <>
      <Transition show={props.isOpen} as={Fragment}>
        <Transition.Child
          enter="transition-opacity ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className=" py-6 px-8 flex flex-col w-full h-full"
        >
          <div className="overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar scrollbar-thumb-slate-500 scrollbar-track-slate-300">
            <div>
              <p className="text-base font-semibold text-nowrap truncate ">
                Appointment ID {props.content.bookingOptions.id}
              </p>
            </div>

            <p className="text-sm font-semibold text-stone-400">
              15 days from now
            </p>
            <p className="text-2xl font-bold py-2">
              {props.content.bookingOptions.room.gallery.name}
            </p>
            <div className="flex flex-wrap gap-x-2 items-baseline mb-2">
              <RenderStatus
                status={props.content.bookingOptions.status as BookingStatus}
              />
              <p className="text-sm font-semibold text-stone-400">
                Action taken on 12/01
              </p>
            </div>
            <div className="flex flex-col gap-y-2 font-semibold mb-4">
              <div className="flex gap-x-2 ">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 7V3M16 7V3M7 11H17M5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21Z"
                    stroke="#0C0A09"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>{" "}
                <div>
                  {
                    transformDate(
                      props.content.bookingOptions.start_time as string
                    ).day
                  }
                  /
                  {
                    transformDate(
                      props.content.bookingOptions.start_time as string
                    ).month
                  }
                  /
                  {
                    transformDate(
                      props.content.bookingOptions.start_time as string
                    ).year
                  }
                </div>
                <div>
                  {
                    transformDate(
                      props.content.bookingOptions.start_time as string
                    ).hour
                  }
                  {"."}
                  {
                    transformDate(
                      props.content.bookingOptions.start_time as string
                    ).minute
                  }
                  {" - "}
                  {
                    transformDate(
                      props.content.bookingOptions.start_time as string
                    ).hour
                  }
                  {"."}
                  {
                    transformDate(
                      props.content.bookingOptions.start_time as string
                    ).minute
                  }
                </div>
              </div>
              <div className="flex gap-x-2 ">
                <svg
                  width="24"
                  height="20"
                  viewBox="0 0 22 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.0002 8.66732C14.0002 9.55137 13.649 10.3992 13.0239 11.0243C12.3987 11.6495 11.5509 12.0007 10.6668 12.0007C9.78277 12.0007 8.93493 11.6495 8.30981 11.0243C7.68469 10.3992 7.3335 9.55137 7.3335 8.66732C7.3335 7.78326 7.68469 6.93542 8.30981 6.3103C8.93493 5.68517 9.78277 5.33398 10.6668 5.33398C11.5509 5.33398 12.3987 5.68517 13.0239 6.3103C13.649 6.93542 14.0002 7.78326 14.0002 8.66732Z"
                    fill="black"
                  />
                  <path
                    d="M2.66667 2.66667C1.95942 2.66667 1.28115 2.94762 0.781049 3.44772C0.280952 3.94781 0 4.62609 0 5.33333L0 13.3333C0 14.0406 0.280952 14.7189 0.781049 15.219C1.28115 15.719 1.95942 16 2.66667 16H18.6667C19.3739 16 20.0522 15.719 20.5523 15.219C21.0524 14.7189 21.3333 14.0406 21.3333 13.3333V5.33333C21.3333 4.62609 21.0524 3.94781 20.5523 3.44772C20.0522 2.94762 19.3739 2.66667 18.6667 2.66667H17.104C16.3968 2.66652 15.7186 2.38547 15.2187 1.88533L14.1147 0.781333C13.6147 0.281202 12.9365 0.000151033 12.2293 0H9.104C8.39681 0.000151033 7.71865 0.281202 7.21867 0.781333L6.11467 1.88533C5.61469 2.38547 4.93652 2.66652 4.22933 2.66667H2.66667ZM3.33333 5.33333C3.15652 5.33333 2.98695 5.2631 2.86193 5.13807C2.7369 5.01305 2.66667 4.84348 2.66667 4.66667C2.66667 4.48986 2.7369 4.32029 2.86193 4.19526C2.98695 4.07024 3.15652 4 3.33333 4C3.51014 4 3.67971 4.07024 3.80474 4.19526C3.92976 4.32029 4 4.48986 4 4.66667C4 4.84348 3.92976 5.01305 3.80474 5.13807C3.67971 5.2631 3.51014 5.33333 3.33333 5.33333ZM15.3333 8.66667C15.3333 9.90434 14.8417 11.0913 13.9665 11.9665C13.0913 12.8417 11.9043 13.3333 10.6667 13.3333C9.42899 13.3333 8.24201 12.8417 7.36684 11.9665C6.49167 11.0913 6 9.90434 6 8.66667C6 7.42899 6.49167 6.24201 7.36684 5.36684C8.24201 4.49167 9.42899 4 10.6667 4C11.9043 4 13.0913 4.49167 13.9665 5.36684C14.8417 6.24201 15.3333 7.42899 15.3333 8.66667Z"
                    fill="black"
                  />
                </svg>{" "}
                {props.content.bookingOptions.room.gallery.hours} hours
                photography event
              </div>
              <div className="flex gap-x-2 ">
                <svg
                  width="24"
                  height="20"
                  viewBox="0 0 14 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2.05051 2.10114C3.36333 0.788317 5.14389 0.0507813 7.0005 0.0507812C8.85711 0.0507813 10.6377 0.788317 11.9505 2.10114C13.2633 3.41396 14.0009 5.19453 14.0009 7.05114C14.0009 8.90775 13.2633 10.6883 11.9505 12.0011L7.0005 16.9511L2.05051 12.0011C1.40042 11.3511 0.884739 10.5794 0.532912 9.73009C0.181084 8.88076 0 7.97045 0 7.05114C0 6.13183 0.181084 5.22152 0.532912 4.37219C0.884739 3.52286 1.40042 2.75116 2.05051 2.10114ZM7.0005 9.05114C7.53094 9.05114 8.03965 8.84042 8.41472 8.46535C8.78979 8.09028 9.00051 7.58157 9.00051 7.05114C9.00051 6.52071 8.78979 6.012 8.41472 5.63692C8.03965 5.26185 7.53094 5.05114 7.0005 5.05114C6.47007 5.05114 5.96136 5.26185 5.58629 5.63692C5.21122 6.012 5.0005 6.52071 5.0005 7.05114C5.0005 7.58157 5.21122 8.09028 5.58629 8.46535C5.96136 8.84042 6.47007 9.05114 7.0005 9.05114Z"
                    fill="black"
                  />
                </svg>
                {props.content.bookingOptions.room.gallery.location}
              </div>
              <div className="flex gap-x-2 mb-4 text-stone-400">
                <svg
                  width="24"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 0.5C8.68678 0.5 7.38642 0.758658 6.17317 1.2612C4.95991 1.76375 3.85752 2.50035 2.92893 3.42893C1.05357 5.3043 0 7.84784 0 10.5C0 13.1522 1.05357 15.6957 2.92893 17.5711C3.85752 18.4997 4.95991 19.2362 6.17317 19.7388C7.38642 20.2413 8.68678 20.5 10 20.5C12.6522 20.5 15.1957 19.4464 17.0711 17.5711C18.9464 15.6957 20 13.1522 20 10.5C20 9.18678 19.7413 7.88642 19.2388 6.67317C18.7362 5.45991 17.9997 4.35752 17.0711 3.42893C16.1425 2.50035 15.0401 1.76375 13.8268 1.2612C12.6136 0.758658 11.3132 0.5 10 0.5ZM14.2 14.7L9 11.5V5.5H10.5V10.7L15 13.4L14.2 14.7Z"
                    fill="#969696"
                  />
                </svg>
                {props.content.bookingOptions.room.gallery.delivery_time} days
                delivery
              </div>

              {renderDetail}
            </div>

            <div className="text-lg flex font-bold justify-between">
              <div>Total</div>{" "}
              <div>
                {props.content.bookingOptions.room.gallery.price}
                {" THB"}
              </div>
            </div>

            <hr className="h-px my-4 bg-gray-200 border-2 dark:bg-gray-700" />

            <div className="flex flex-col mt-2 gap-y-4  ">
              <div className="text-lg font-bold"> Photographer</div>
              <div className="flex gap-x-4">
                <div className="relative w-12 h-12 ">
                  <Image
                    className="object-cover rounded-full"
                    src={
                      props.content.photographer.profile_picture_url as string
                    }
                    alt=""
                    fill={true}
                  />
                </div>
                <div className="text-sm font-semibold">
                  <p>{props.content.photographer.data?.firstname}</p>
                  <p>{props.content.photographer.data?.lastname}</p>
                  <p className="text-stone-400">
                    @{props.content.photographer.data?.firstname}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-lg flex flex-col font-bold mt-2 font-semibold gap-y-4 ">
              <div className="text-lg font-bold"> Customer</div>
              <div className="flex gap-x-4">
                <div className="relative w-12 h-12">
                  <Image
                    className="object-cover rounded-full"
                    fill={true}
                    src={props.content.customer.profile_picture_url as string}
                    alt=""
                  />
                </div>
                <div className="text-sm font-semibold">
                  <p>{props.content.customer.data?.firstname}</p>
                  <p>{props.content.customer.data?.lastname}</p>
                  <p className="text-stone-400">
                    @{props.content.customer.data?.firstname}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <button
              className="mt-4 px-4 py-2 bg-orange-400 text-white rounded font-semibold text-lg"
              onClick={handleClickChat}
            >
              Chat
            </button>
            <RenderButtonByStatus
              status={props.content.bookingOptions.status as BookingStatus}
              isOwner={props.isPackageOwner}
              togglePage={props.togglePage}
            />
          </div>
        </Transition.Child>
      </Transition>
    </>
  );
}
