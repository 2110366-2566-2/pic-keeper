"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward, IoIosAdd } from "react-icons/io";
import { HiOutlinePlusSm } from "react-icons/hi";
import { GrLocation } from "react-icons/gr";
import { classNames } from "@/utils/list";

interface FileWithPreview {
  file: File;
  preview: string;
}

const CreateGallery = () => {
  const [additionalInputs, setAdditionalInputs] = useState(1);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(-1);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddInput = () => {
    setAdditionalInputs(additionalInputs + 1);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const preview = URL.createObjectURL(file);
      const updatedFiles = [{ file, preview }, ...files];
      console.log(updatedFiles);
      setFiles(updatedFiles);
    }
  };

  const navigateImages = (direction: "left" | "right") => {
    setCurrentImageIndex((prevIndex) => {
      if (direction === "left") {
        return prevIndex > -1 ? prevIndex - 1 : files.length - 1;
      } else {
        return prevIndex < files.length - 1 ? prevIndex + 1 : -1;
      }
    });
    console.log(currentImageIndex);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mx-auto rounded-lg shadow-lg p-4 grid grid-cols-4 gap-8">
      <div className="col-span-2 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <button
            className="text-black text-6xl"
            onClick={() => navigateImages("left")}
          >
            <IoIosArrowBack />
          </button>

          <div className="flex flex-col items-center justify-center rounded-lg relative w-72 h-96">
            <div
              className={classNames(
                currentImageIndex == -1 ? "visible" : "hidden",
                "flex flex-col items-center justify-center rounded-2xl bg-gray-50 w-full h-full"
              )}
            >
              <Image
                src="/images/upload-to-cloud.png"
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
                className="mt-8 text-white bg-amber-500 rounded px-6 py-1"
                onClick={handleBrowseClick}
              >
                Browse
              </button>
              <span className="mt-4 text-gray-500">Max file size: 20 MB</span>
              <span className="text-gray-500">
                Supported file types: JPG, PNG
              </span>
            </div>
            {currentImageIndex >= 0 && (
              <Image
                src={files[currentImageIndex].preview}
                alt="Selected Image"
                fill={true}
                className="object-cover rounded-2xl"
              />
            )}
          </div>

          <button
            className="text-black text-6xl"
            onClick={() => navigateImages("right")}
          >
            <IoIosArrowForward />
          </button>
        </div>

        <div className="flex overflow-x-auto space-x-4 p-1 scrollbar-hide">
          {files.map((file, index) => (
            <div
              key={index}
              className={classNames(
                index === currentImageIndex
                  ? "ring-2 ring-amber-400"
                  : "ring-1 ring-gray-200",
                "flex-shrink-0 relative w-36 h-36 rounded-lg bg-gray-200 overflow-hidden cursor-pointer"
              )}
              onClick={() => setCurrentImageIndex(index)}
            >
              <Image
                src={file.preview}
                alt={`Selected Image ${index + 1}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
          <div
            className={classNames(
              currentImageIndex === -1
                ? "ring-2 ring-amber-400"
                : "ring-1 ring-gray-200",
              "flex-shrink-0 relative w-36 h-36 rounded-lg bg-gray-200 overflow-hidden cursor-pointer flex items-center justify-center"
            )}
            onClick={handleBrowseClick}
          >
            <HiOutlinePlusSm className="text-4xl text-gray-500" />
          </div>
        </div>
      </div>

      <div className="col-span-2 flex-1">
        <div className="overflow-y-scroll h-[62vh]">
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
                  <input id="hours" type="text" className="form-input"></input>
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
                  <input id="deliveryTime" type="text" className="form-input" />
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
