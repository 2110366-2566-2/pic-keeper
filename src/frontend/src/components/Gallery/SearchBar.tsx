"use client";

import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoSearch } from "react-icons/io5";
import { MdOutlineLocationOn } from "react-icons/md";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { MdOutlinePriceCheck } from "react-icons/md";
import { SearchFilter } from "@/types/gallery";
import { searchOption } from "../Landing";
import { classNames } from "@/utils/list";

interface Props {
  setSearchFilter: React.Dispatch<React.SetStateAction<SearchFilter>>;
}

const SearchBar = ({ setSearchFilter }: Props) => {
  const [galleryName, setGalleryName] = useState("");
  const [photographerName, setPhotographerName] = useState("");
  const [selectedOption, setSelectedOption] = useState(
    searchOption.PHOTOGRAPHER_NAME
  );
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(9999);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const togglePopover = () => {
    if (Number(minPrice) <= Number(maxPrice)) {
      setErrorMessage("");
      setIsPopoverOpen(!isPopoverOpen);
    } else {
      setErrorMessage("Invalid Input");
    }
  };

  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div className="grid grid-cols-7 gap-4 pt-4 pb-4 mx-4">
      <div className="">
        <Menu as="div" className="relative inline-block text-left">
          <div className="flex">
            <Menu.Button className="whitespace-nowrap inline-flex w-full justify-center rounded-md px-5 py-2 text-sm font-medium hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
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
              <div className="p-1 w-44 flex flex-col items-stretch justify-center">
                {/* By photographer option */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        setSelectedOption(searchOption.PHOTOGRAPHER_NAME);
                        setGalleryName("");
                      }}
                      className={classNames(
                        selectedOption == searchOption.PHOTOGRAPHER_NAME
                          ? "text-yellow-500 underline underline-offset-1"
                          : "",
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700 "
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
                      onClick={() => {
                        setSelectedOption(searchOption.GALLERY_NAME);
                        setPhotographerName("");
                      }}
                      className={classNames(
                        selectedOption == searchOption.GALLERY_NAME
                          ? "text-yellow-500 underline underline-offset-1"
                          : "",
                        active ? "bg-gray-100" : "",
                        "block py-2 text-sm text-gray-900 w-full "
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
      <div className="relative col-span-3">
        {selectedOption == searchOption.PHOTOGRAPHER_NAME && (
          <input
            type="text"
            className="form-input ring-yellow-400 hover:ring-yellow-500 hover:ring-3"
            placeholder="Photographer name"
            value={photographerName}
            onChange={(e) => setPhotographerName(e.target.value)}
          />
        )}
        {selectedOption == searchOption.GALLERY_NAME && (
          <input
            type="text"
            className="form-input ring-yellow-400 hover:ring-yellow-500 hover:ring-3"
            placeholder="Gallery name"
            value={galleryName}
            onChange={(e) => setGalleryName(e.target.value)}
          />
        )}
        <IoSearch
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-90"
          size={20}
        />
      </div>
      <div className="relative">
        <input
          type="text"
          className="form-input ring-gray-800 hover:ring-gray-900 focus:ring-gray-900 hover:ring-3"
          placeholder="Set Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <MdOutlineLocationOn
          className="bg-white absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-900 font-semibold"
          size={20}
        />
      </div>
      <div className="relative">
        <input
          type="text"
          onClick={togglePopover}
          className="form-input ring-gray-800 hover:ring-gray-900 focus:ring-gray-900 hover:ring-3"
          placeholder="฿0 - ฿9999"
          value={`฿${minPrice} - ฿${maxPrice}`}
          readOnly
        />
        {isPopoverOpen ? (
          <MdOutlinePriceCheck
            className="bg-white absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-900 font-semibold"
            size={20}
            onClick={togglePopover}
          />
        ) : (
          <FaMoneyBill1Wave
            className="bg-white absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-900 font-semibold"
            size={20}
            onClick={togglePopover}
          />
        )}
        {isPopoverOpen && (
          <div className="absolute z-10 p-4 mt-2 bg-white shadow-lg left-1/2 transform -translate-x-1/2 rounded-xl">
            <div className="flex flex-row space-x-4">
              <div className="">
                Min Price
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  placeholder="฿0"
                  className="px-4 py-2 border rounded focus:ring focus:border-blue-300"
                />
                {errorMessage && (
                  <div className="text-red-500 text-sm">{errorMessage}</div>
                )}
              </div>
              <div className="">
                Max Price
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  placeholder="฿9999"
                  className="px-4 py-2 border rounded focus:ring focus:border-blue-300"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        <button
          className="p-2 pl-4 bg-gray-400 rounded-md w-full text-white transition duration-300s ease-in-out hover:bg-gray-500"
          onClick={() => {
            const filters = {
              ...(galleryName && { gallery_name: galleryName }),
              ...(photographerName && { photographer_name: photographerName }),
              ...(location && { location }),
              min_price: minPrice,
              max_price: maxPrice,
            };
            setSearchFilter(filters);
          }}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
