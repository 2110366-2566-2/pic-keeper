"use client";

import { classNames } from "@/utils/list";
import { Menu, Transition } from "@headlessui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment, ReactNode } from "react";
import { MdArrowDropUp, MdOutlineArrowDropDown } from "react-icons/md";
import ProfileImage from "../ProfileImage";

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
          "block px-4 py-2 text-sm z-50"
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
    <Menu as="div" className="relative ml-3 z-99">
      {({ open }) => (
        <>
          <Menu.Button className="flex items-center gap-2 text-sm rounded-full focus:ring-2 focus:ring-offset-2 focus:outline-none">
            <ProfileImage
              src={session?.user?.profile_picture_url || "/images/nature.svg"}
              size={8}
            />

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
            <Menu.Items className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {!session ? (
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/auth/login"
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm z-50"
                      )}
                    >
                      Login / Register
                    </Link>
                  )}
                </Menu.Item>
              ) : (
                <>
                  <MenuItem href={`/view-profile/${session.user.data?.id}`}>
                    Your Profile
                  </MenuItem>
                  {
                    session.user.data?.is_admin === true && (
                      <MenuItem href="/admin/dashboard/verification-tickets">Admin dashboard</MenuItem>
                    )
                  }
                  <MenuItem href="/settings/edit-profile">Settings</MenuItem>
                  <MenuItem href="/report-issues">Report issues</MenuItem>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/auth/login"
                        onClick={() => signOut()}
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Logout
                      </Link>
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
