"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward, IoIosAdd } from "react-icons/io";
import { HiOutlinePlusSm } from "react-icons/hi";
import { GrLocation } from "react-icons/gr";

const CreateGallery = () => {
  const [additionalInputs, setAdditionalInputs] = useState(1);
  const [file, setFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddInput = () => {
    setAdditionalInputs(additionalInputs + 1);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mx-auto  rounded-lg shadow-lg  bg-white flex items-center justify-between p-4">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center ml-12 mt-4">
          <button className="text-black mr-5 text-6xl">
            <IoIosArrowBack />
          </button>

          <div className="flex flex-col items-center justify-center rounded-lg w-[25vw] h-[30vh]">
            {!file && (
              <div className="flex flex-col items-center justify-center rounded-lg w-full h-full bg-[#FBFAFA] p-4">
                <Image
                  src="/images/UploadToCloud.png"
                  alt="Upload"
                  width={100}
                  height={100}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  className="mt-8 text-white bg-[#E19007] rounded px-6 py-1"
                  onClick={handleBrowseClick}
                >
                  Browse
                </button>
                <span className="mt-4 text-gray-500">Max file size: 20 MB</span>
                <span className="text-gray-500">
                  Supported file types: JPG, PNG
                </span>
              </div>
            )}
            {file && (
              <div className="mt-4">
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Selected Image"
                  width={240}
                  height={240}
                />
              </div>
            )}
          </div>

          <button className="text-black ml-5 text-6xl">
            <IoIosArrowForward />
          </button>
        </div>

        <div className="mt-20 ml-10">
          <div className="group">
            <div className="flex items-center justify-center rounded-2xl bg-[#FBFAFA] relative overflow-hidden w-[7vw] h-[18vh] border-4 border-transparent group-hover:border-yellow-500 group-hover:shadow-outline">
              {!file && <HiOutlinePlusSm className="text-gray-500 text-8xl" />}
              {file && (
                <div className="rounded-2xl overflow-hidden w-full h-full relative">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="Selected Image"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex flex-col overflow-y-auto gap-2">
          <div className="flex flex-col">
            <label htmlFor="gallery" className="label-normal">
              Gallery name
            </label>
            <input id="gallery" type="text" className="form-input" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="description" className="label-normal">
              Description
            </label>
            <textarea id="description" rows={4} className="form-input" />
          </div>

          <div className="flex items-center gap-4">
            <div>
              <label htmlFor="hours" className="label-normal">
                Hours
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="hours"
                  type="text"
                  className="form-input px-0"
                ></input>
                <span className="label-normal">Hrs</span>
              </div>
            </div>

            <div className="flex-grow">
              <label htmlFor="location" className="label-normal">
                Location
              </label>
              <div className="relative">
                <input id="location" type="text" className="form-input" />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <GrLocation />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="deliveryTime" className="label-normal">
                Delivery time
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="deliveryTime"
                  type="text"
                  className="form-input px-0"
                />
                <span className="label-normal">Days</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="mr-2">What includes in this package</span>
          </div>
          {[...Array(additionalInputs)].map((_, index) => (
            <input key={index} type="text" className="form-input" />
          ))}
          {/* Click to add button */}
          <div className="flex items-center">
            <button
              className="text-yellow-600 flex items-center"
              onClick={handleAddInput}
            >
              <IoIosAdd className="w-8 h-auto" />
              Click to add
            </button>
          </div>
          <div className="flex items-center">
            <div className="flex flex-col ">
              <label id="price" className="label-normal">
                Price
              </label>
              <div className="flex items-center gap-2">
                <input type="text" className="form-input" />
                <span className="label-normal">THB</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button className="btn-cancel mt-4 px-2">Cancel</button>
          <button className="btn-primary mt-4 px-5">Save</button>
        </div>
      </div>
    </div>
  );
};

export default CreateGallery;
