"use client";
import { Gender } from "@/types/user";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { sortOption } from "../Landing";
import { classNames } from "@/utils/list";

interface Props {
  selectedOption: string;
  setSelectedOption: Function;
  selectedGender: Gender | undefined;
  setSelectedGender: Function;
}

const GalleryFilter = (data: Props) => {
  const handleGenderSelect = (gender: Gender) => {
    const isAlreadySelected = data.selectedGender === gender;
    data.setSelectedGender(isAlreadySelected ? undefined : gender);
  };

  return (
    <div className="flex flex-col p-5 space-y-4">
      <div className="font-semibold">Sort By</div>
      <Menu as="div" className="relative inline-block text-left">
        <div className="flex">
          <Menu.Button className="inline-flex w-full justify-center rounded-md py-2 text-sm font-medium bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
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
          <Menu.Items className="absolute w-full mt-2 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="px-1 py-1 ">
              {/* By photographer option */}
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() =>
                      data.setSelectedOption(sortOption.RECOMMENDED)
                    }
                    className={classNames(
                      data.selectedOption == sortOption.RECOMMENDED
                        ? "text-yellow-500 underline underline-offset-1 "
                        : "",
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-700 w-full"
                    )}
                  >
                    Recommended
                  </button>
                )}
              </Menu.Item>
              {/* By gallery name option */}
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => data.setSelectedOption(sortOption.RATING)}
                    className={classNames(
                      data.selectedOption == sortOption.RATING
                        ? "text-yellow-500 underline underline-offset-1"
                        : "",
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-900 w-full"
                    )}
                  >
                    Rating
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => data.setSelectedOption(sortOption.PRICE)}
                    className={classNames(
                      data.selectedOption == sortOption.PRICE
                        ? "text-yellow-500 underline underline-offset-1"
                        : "",
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-900 w-full"
                    )}
                  >
                    Price
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      <div className="font-semibold">Filter By</div>
      <div className="">
        <div className="font-semibold">Gender of Photographer</div>
        <div className="grid grid-cols-3 gap-8 py-2">
          {Object.values(Gender).map((gender) => (
            <button
              key={gender}
              className={
                data.selectedGender === gender
                  ? "outline outline-amber-400 rounded-md p-1 text-amber-400"
                  : "rounded-md p-1"
              }
              onClick={() => handleGenderSelect(gender)}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryFilter;
