"use client";

import { RiUserFill } from "react-icons/ri";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdCamera } from "react-icons/md";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { IoMdClose } from "react-icons/io";
import { HiOutlineBars3 } from "react-icons/hi2";

const NavBar = () => {
  const pathName = usePathname();

  const navigation = [
    {
      name: "Search",
      href: "/search",
      current: pathName === "/search",
    },
    {
      name: "My Booking",
      href: "/myBooking",
      current: pathName === "/myBooking",
    },
  ];

  const classNames = (...classes: string[]) =>
    classes.filter(Boolean).join(" ");

  return (
    <Disclosure>
      {({ open }: { open: boolean }) => (
        <>
          <nav className="w-screen border-b-2 border-gray-200 ">
            <div className="mx-auto  px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 gap-4 items-center  justify-between">
                <div className="flex gap-2 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center px-2">
                    <MdCamera className="text-yellow-500 cursor-pointer size-6" />
                  </div>
                  <div className="hidden sm:flex items-center">
                    <nav className="flex space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "text-gray-700 border-b-2 border-black"
                              : "text-gray-600 hover:text-gray-700",
                            "flex items-center justify-center text-sm font-medium h-full"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
                {/* <button className="flex-1 max-w-xl border-[1px] border-gray-300 px-2 py-[0.1rem] text-start text-gray-300 font-thin rounded">
                  Search
                </button> */}
                <div className="gap-4 items-center hidden sm:flex">
                  <IoNotificationsOutline className="text-gray-900 cursor-pointer" />
                  <RiUserFill className="text-gray-900 stroke-2 cursor-pointer" />
                  <a className="text-gray-900 font-medium">Test User</a>
                </div>
                <div className="inset-y-0 right-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-yellow-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <IoMdClose className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <HiOutlineBars3
                        className="block h-6 w-6"
                        aria-hidden="true"
                      />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </nav>
          <Disclosure.Panel className="sm:hidden border-b-2 border-gray-200">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button key={item.name} className="block">
                  <Link
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-700 text-white"
                        : "text-gray-600 hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Link>
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default NavBar;
