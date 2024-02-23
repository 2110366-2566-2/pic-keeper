"use client";

import { IoNotificationsOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { IoMdClose } from "react-icons/io";
import { HiOutlineBars3 } from "react-icons/hi2";
import Image from "next/image";
import { Fragment } from "react";
import { MdOutlineArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { useSession } from "next-auth/react";
import userService from "@/services/user";
import useApiClientWithAuth from "@/libs/hooks/useApiClientWithAuth";

const NavBar = () => {
  const pathName = usePathname();

  const { data: session } = useSession();
  const apiClientWithAuth = useApiClientWithAuth();

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

  // const profileMenuItem = [
  //   {
  //     name: "View Profile",
  //     href: "/user/my-profile",
  //     current: pathName === "/user/my-profile"
  //   },
  //   {
  //     name: "Report issues",
  //     href: "/report-issues",
  //     current: pathName === "/report-issues"
  //   },
  //   {
  //     name: "Settings",
  //     href: "/settings",
  //     current: pathName === "/settings"
  //   },
  // ]

  const classNames = (...classes: string[]) =>
    classes.filter(Boolean).join(" ");

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
                {/* <button className="flex-1 max-w-xl border-[1px] border-gray-300 px-2 py-[0.1rem] text-start text-gray-300 font-thin rounded">
                  Search
                </button> */}
                <div className="inset-y-0 right-0 flex gap-2 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <IoNotificationsOutline className="text-gray-900 cursor-pointer" />
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    {({ open }) => (
                      <>
                        <div>
                          <Menu.Button className="relative flex pr-2 rounded-full items-center gap-2 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <div className="relative w-8 h-8 rounded-full">
                              <Image
                                className="object-cover rounded-full"
                                fill={true}
                                src={
                                  session
                                    ? session.user.profile_picture_url
                                    : "/images/no-picture.jpeg"
                                }
                                alt=""
                              />
                            </div>

                            <h2>
                              {session ? session.user.data.name : "Guest"}
                            </h2>
                            {open ? (
                              <MdArrowDropUp />
                            ) : (
                              <MdOutlineArrowDropDown />
                            )}
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {!session ? (
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="/auth/login"
                                    className={classNames(
                                      "text-amber-700",
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    Login / Register
                                  </a>
                                )}
                              </Menu.Item>
                            ) : (
                              ""
                            )}
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="user/edit-profile"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Your Profile
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="/report-issues"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Report issues
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="/settings"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Settings
                                </a>
                              )}
                            </Menu.Item>
                            {session ? (
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() =>
                                      userService.logout(apiClientWithAuth)
                                    }
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    Logout
                                  </button>
                                )}
                              </Menu.Item>
                            ) : (
                              ""
                            )}
                          </Menu.Items>
                        </Transition>
                      </>
                    )}
                  </Menu>
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
