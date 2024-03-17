"use client";

import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoSearch } from "react-icons/io5";
import { MdOutlineLocationOn } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaMoneyBill1Wave } from "react-icons/fa6";

interface Props {
  searchGallery: string;
  setSearchGallery: Function;
  selectedOption: string;
  setSelectedOption: Function;
  searchPlace: string;
  setSearchPlace: Function;
  selectDate: string;
  setSelectDate: Function;
  minPrice: number;
  setMinPrice: Function;
  maxPrice: number;
  setMaxPrice: Function;
  isPopoverOpen : boolean;
  setIsPopoverOpen : Function;
}

const SearchBar = (data: Props) => {
  const classNames = (...classes: string[]) =>
    classes.filter(Boolean).join(" ");

  return (
    <div className="grid grid-cols-7 gap-4 pt-4 pb-4">
      <div className="">
        <Menu as="div" className="relative inline-block text-left">
          <div className="flex">
            <Menu.Button className="inline-flex w-full justify-center rounded-md px-5 py-2 text-sm font-medium hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
              {data.selectedOption}
              <RiArrowDropDownLine className="text-xl" />
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
            <Menu.Items className="absolute mt-2 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="px-1 py-1">
                {/* By photographer option */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => data.setSelectedOption("By photographer")}
                      className={classNames(
                        data.selectedOption == "By photographer"
                          ? "text-amber-500 underline underline-offset-1"
                          : "",
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      By photographer
                    </button>
                  )}
                </Menu.Item>
                {/* By gallery name option */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => data.setSelectedOption("By gallery name")}
                      className={classNames(
                        data.selectedOption == "By gallery name"
                          ? "text-amber-500 underline underline-offset-1"
                          : "",
                        active ? "bg-gray-100" : "",
                        "block py-2 text-sm text-gray-900 w-full"
                      )}
                    >
                      By gallery name
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <div className="relative col-span-2">
        <input
          type="text"
          className="p-2 pl-4 outline outline-amber-400 rounded-md w-full"
          placeholder={
            data.selectedOption === "By photographer"
              ? "Search photographer"
              : "Search gallery name"
          }
        />
        <IoSearch
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-900"
          size={20}
        />
      </div>
      <div className="relative">
        <input
          type="text"
          className="p-2 pl-4 outline outline-gray-900 rounded-md w-full text-gray-900"
          placeholder={data.selectDate}
        />
        <FaRegCalendarAlt
          className="bg-white absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-900 font-semibold"
          size={20}
        />
      </div>
      <div className="relative">
        <input
          type="text"
          className="p-2 pl-4 outline outline-gray-900 rounded-md w-full text-gray-900"
          placeholder={data.searchPlace}
        />
        <MdOutlineLocationOn
          className="bg-white absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-900 font-semibold"
          size={20}
        />
      </div>
      <div className="relative">
        <input
          type="text"
          className="p-2 pl-4 outline outline-gray-900 rounded-md w-full text-gray-900"
          placeholder={`${data.minPrice || "min"} - ${data.maxPrice || "max"} THB`}
          readOnly // make the input read-only if it's just for displaying the selected range
        />
        <FaMoneyBill1Wave
          className="bg-white absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-900 font-semibold"
          size={20}
        />
      </div>
      <div className="relative">
        <button className="p-2 pl-4 bg-gray-400 rounded-md w-full text-white">
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
