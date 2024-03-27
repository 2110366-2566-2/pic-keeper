import { Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function Complete(props: { isOpen: boolean; content: string }) {
  return (
    <Transition show={props.isOpen} as={Fragment}>
      <Transition.Child
        enter="transition-opacity ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="p-4 rounded-lg">
            <div className="flex flex-col m-8 items-center gap-y-2">
              <svg
                fill="#53af08"
                width="100px"
                height="100px"
                viewBox="0 0 1920 1920"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#53af08"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M960 1807.059c-467.125 0-847.059-379.934-847.059-847.059 0-467.125 379.934-847.059 847.059-847.059 467.125 0 847.059 379.934 847.059 847.059 0 467.125-379.934 847.059-847.059 847.059M960 0C430.645 0 0 430.645 0 960s430.645 960 960 960 960-430.645 960-960S1489.355 0 960 0M854.344 1157.975 583.059 886.69l-79.85 79.85 351.135 351.133L1454.4 717.617l-79.85-79.85-520.206 520.208Z"
                    fillRule="evenodd"
                  ></path>{" "}
                </g>
              </svg>
              <span className="font-bold">{props.content}</span>
            </div>
          </div>
        </div>
      </Transition.Child>
    </Transition>
  );
}
