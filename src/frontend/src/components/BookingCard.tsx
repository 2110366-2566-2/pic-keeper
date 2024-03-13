"use client";
import Image from "next/image";
import { useState } from "react";


interface BookOptions {
  props: {
    id: string;
    name: string;
    customer: { name: string; imageUrl: string };
    date: string;
    price: string;
    status: string;
  };
  openModal:Function;
  setModalProps:Function;
}

export default function BookingCard(options: BookOptions) {


  return (
    <>
      <div
        className="bg-white my-4 py-8 grid sm:grid-cols-5  lg:grid-cols-10 gap-x-3 gap-y-3 py-3 rounded-lg shadow-md hover:shadow-stone-400"
        onClick={() => {
          options.openModal();
          options.setModalProps(options.props)
        }}
      >
        <div className="pl-4 text-base font-semibold">{options.props.id}</div>
        <div className="col-span-2 pl-4">
          <p className="text-base font-semibold">Gallery name</p>
          <div className="flex gap-x-2">
            <div>
              <svg
                width="14"
                height="24"
                viewBox="0 0 14 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2.05051 2.60114C3.36333 1.28832 5.14389 0.550781 7.0005 0.550781C8.85711 0.550781 10.6377 1.28832 11.9505 2.60114C13.2633 3.91396 14.0009 5.69453 14.0009 7.55114C14.0009 9.40775 13.2633 11.1883 11.9505 12.5011L7.0005 17.4511L2.05051 12.5011C1.40042 11.8511 0.884739 11.0794 0.532912 10.2301C0.181084 9.38076 0 8.47045 0 7.55114C0 6.63183 0.181084 5.72152 0.532912 4.87219C0.884739 4.02286 1.40042 3.25116 2.05051 2.60114ZM7.0005 9.55114C7.53094 9.55114 8.03965 9.34042 8.41472 8.96535C8.78979 8.59028 9.00051 8.08157 9.00051 7.55114C9.00051 7.02071 8.78979 6.512 8.41472 6.13692C8.03965 5.76185 7.53094 5.55114 7.0005 5.55114C6.47007 5.55114 5.96136 5.76185 5.58629 6.13692C5.21122 6.512 5.0005 7.02071 5.0005 7.55114C5.0005 8.08157 5.21122 8.59028 5.58629 8.96535C5.96136 9.34042 6.47007 9.55114 7.0005 9.55114Z"
                  fill="#A8A29E"
                />
              </svg>
            </div>

            <p className="font-semibold text-stone-400">{options.props.name}</p>
          </div>
        </div>
        <div className="col-span-2 flex gap-x-2 pl-4">
          <div className="relative w-8 h-8 rounded-full">
            <Image
              className="object-cover rounded-full"
              fill={true}
              src={options.props.customer.imageUrl}
              alt=""
            />
          </div>
          <div className="">
            <p className="text-sm font-semibold">Customer name</p>
            <p className="text-sm font-semibold text-stone-400">
              @{options.props.customer.name}
            </p>
          </div>
        </div>
        <div className="col-span-2 pl-4">
          <p className="text-base font-semibold flex gap-x-2">
            <svg
              width="19"
              height="22"
              viewBox="0 0 19 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.33333 6.41667V2.75M12.6667 6.41667V2.75M5.54167 10.0833H13.4583M3.95833 19.25H15.0417C15.4616 19.25 15.8643 19.0568 16.1613 18.713C16.4582 18.3692 16.625 17.9029 16.625 17.4167V6.41667C16.625 5.93044 16.4582 5.46412 16.1613 5.1203C15.8643 4.77649 15.4616 4.58333 15.0417 4.58333H3.95833C3.53841 4.58333 3.13568 4.77649 2.83875 5.1203C2.54181 5.46412 2.375 5.93044 2.375 6.41667V17.4167C2.375 17.9029 2.54181 18.3692 2.83875 18.713C3.13568 19.0568 3.53841 19.25 3.95833 19.25Z"
                stroke="#0C0A09"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {options.props.date}
          </p>
          <p className="text-base font-semibold">14.00 - 18.00</p>
          <p className="text-xs font-semibold text-stone-400">
            15 days from now
          </p>
        </div>
        <div className="text-base font-bold pl-4">
          <span>{options.props.price} THB</span>
        </div>
        <div className="col-span-2 pl-4">
          <p className="text-base font-bold">Status</p>
          <p>{options.props.status}</p>
        </div>
      </div>
      
      
    </>
  );
}
