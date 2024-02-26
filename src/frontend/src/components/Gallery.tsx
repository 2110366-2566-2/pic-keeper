import React from "react";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

type Props = {
  GalleryName: string;
  Images: string[];
  Photographer: string;
};

const GalleryComponent = (data: Props) => {
  return (
    <div className="rounded-xl shadow-lg bg-white overflow-hidden">
      <div className="relative w-full h-64">
        <Image src={"/images/image1.jpg"} alt="Tiger" layout="fill" objectFit="cover" className="rounded-2xl px-4" />
      </div>
      <div className="flex flex-row space-x-4 p-4">
        <div className="text-4xl flex justify-center items-center">
          <FaUserCircle />
        </div>
        <div className="">
          <div className="font-semibold">Gallery name</div>
          <div className="text-gray-400 font-light">by Photographer's name</div>
        </div>
      </div>
    </div>
  );
};

export default GalleryComponent;
