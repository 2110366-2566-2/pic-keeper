"use client";

import { IoNotificationsOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import { IoMdClose } from "react-icons/io";
import { HiOutlineBars3 } from "react-icons/hi2";
import Image from "next/image";
import ProfileMenu from "./ProfileMenu";
import { classNames } from "@/utils/list";

const NavBar = () => {
  const pathName = usePathname();

  const navigation = [
    {
      name: "My Booking",
      href: "/my-booking",
      current: pathName === "/my-booking",
    },
    {
      name: "Chat",
      href: "/chat",
      current: pathName === "/chat",
    },
  ];

  return (
    <Disclosure>
      {({ open }: { open: boolean }) => (
        <>
          <nav className="w-screen drop-shadow bg-amber-400">
            <div className="mx-auto  px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 gap-4 items-center  justify-between">
                <div className="inset-y-0 right-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-yellow-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
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
                <div className="flex flex-1 gap-2 items-center justify-center sm:items-stretch sm:justify-start">
                  <Link
                    href="/"
                    className="flex flex-shrink-0 items-center px-2"
                  >
                    <Image
                      src={"/images/logo-white.svg"}
                      alt="picKeeper"
                      width={120}
                      height={10}
                    />
                  </Link>
                  <div className="hidden sm:flex items-center">
                    <nav className="flex space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "text-gray-500 border-b-2 border-black"
                              : "text-gray-900 hover:text-gray-700",
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
                <div className="inset-y-0 right-0 flex gap-2 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <IoNotificationsOutline className="text-gray-900 cursor-pointer" />
                  {/* Profile dropdown */}
                  <ProfileMenu />
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
