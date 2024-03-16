"use client";

import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoSearch } from "react-icons/io5";
import { MdOutlineLocationOn } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaMoneyBill1Wave } from "react-icons/fa6";

const SearchBar = (data: Props) => {
  const classNames = (...classes: string[]) =>
    classes.filter(Boolean).join(" ");

  const [searchGallery, setSearchGallery] = useState("Search Gallery");
  const [selectedOption, setSelectedOption] = useState("By photographer");
  const [searchPlace, setSearchPlace] = useState("Set Location");
  const [selectDate, setSelectDate] = useState("Select Date");
  const [priceRange, setPriceRange] = useState("Set Price Range");
  
  return (
    <div className="grid grid-cols-7 gap-4 pt-4 pb-4">
      <div className="">
        <Menu as="div" className="relative inline-block text-left">
          <div className="flex">
            <Menu.Button className="inline-flex w-full justify-center rounded-md px-5 py-2 text-sm font-medium hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
              {selectedOption}
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
                      onClick={() => setSelectedOption("By photographer")}
                      className={classNames(
                        selectedOption == "By photographer"
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
                      onClick={() => setSelectedOption("By gallery name")}
                      className={classNames(
                        selectedOption == "By gallery name"
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
            selectedOption === "By photographer"
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
          placeholder={
            selectDate
          }
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
          placeholder={
            searchPlace
          }
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
          placeholder={
            priceRange
          }
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
    //   <div className="bg-white shadow p-4 flex space-x-2">
    //   <div className="flex items-center border-2 rounded overflow-hidden">
    //     <select className="p-2 outline-none cursor-pointer">
    //       <option>By photographer</option>
    //       <option>Option 1</option>
    //       <option>Option 2</option>
    //     </select>
    //     <input type="text" className="p-2 outline-none" placeholder="Search Gallery" />
    //   </div>
    //   <div className="flex items-center border-2 rounded overflow-hidden">
    //     <input type="text" className="p-2 outline-none" placeholder="17 Sep - 18 Sep" />
    //     <button className="p-2 outline-none">
    //       <i className="far fa-calendar-alt"></i>
    //     </button>
    //   </div>
    //   <div className="flex items-center border-2 rounded overflow-hidden">
    //     <input type="text" className="p-2 outline-none" placeholder="Pathum Wan" />
    //     <button className="p-2 outline-none">
    //       <i className="fas fa-map-marker-alt"></i>
    //     </button>
    //   </div>
    //   <div className="flex items-center border-2 rounded overflow-hidden">
    //     <input type="text" className="p-2 outline-none" placeholder="1,400 - 2,000 THB" />
    //   </div>
    //   <button className="flex items-center justify-center px-4 bg-gray-500 text-white rounded">
    //     Search
    //   </button>
    // </div>
  );
};

export default SearchBar;
