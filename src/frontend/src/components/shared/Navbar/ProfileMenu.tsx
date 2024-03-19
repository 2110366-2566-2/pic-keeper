"use client";

import { classNames } from "@/utils/list";
import { Menu, Transition } from "@headlessui/react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, ReactNode } from "react";
import { MdArrowDropUp, MdOutlineArrowDropDown } from "react-icons/md";

interface Props {
  href: string;
  children: ReactNode;
}

const MenuItem = ({ href, children }: Props) => (
  <Menu.Item>
    {({ active }) => (
      <Link
        href={href}
        className={classNames(
          active ? "bg-gray-100" : "",
          "block px-4 py-2 text-sm"
        )}
      >
        {children}
      </Link>
    )}
  </Menu.Item>
);

const ProfileMenu = () => {
  const { data: session } = useSession();
  return (
    <Menu as="div" className="relative ml-3">
      {({ open }) => (
        <>
          <Menu.Button className="flex items-center gap-2 text-sm rounded-full focus:ring-2 focus:ring-offset-2 focus:outline-none">
            <div className="w-8 h-8 relative rounded-full">
              <Image
                src={
                  session?.user?.profile_picture_url ||
                  "/images/no-picture.jpeg"
                }
                alt=""
                className="rounded-full object-cover"
                fill={true}
              />
            </div>
            <span>{session?.user.data?.firstname || "Guest"}</span>
            {open ? <MdArrowDropUp /> : <MdOutlineArrowDropDown />}
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {!session ? (
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/auth/login"
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Login / Register
                    </Link>
                  )}
                </Menu.Item>
              ) : (
                <>
                  <MenuItem href="/user/edit-profile">Your Profile</MenuItem>
                  <MenuItem href="/settings/edit-profile">Settings</MenuItem>
                  <MenuItem href="/report-issues">Report issues</MenuItem>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => signOut()}
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </>
              )}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default ProfileMenu;
