import React from "react";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

type Props = {
  GalleryName: string;
  Images: string[];
  Photographer: string;
  Price: number;
};

const GalleryComponent = (data: Props) => {
  return (
    <div className="rounded-xl shadow-lg bg-white overflow-hidden">
      {/* Check how many pictures the gallery have 1,2,3? */}
      {data.Images.length === 1 ? (
        <div className="px-2 pt-2">
          <div className="relative w-full h-64">
            <Image
              src={"/images/image1.jpg"}
              alt="Tiger"
              layout="fill"
              objectFit="cover"
              className="rounded-2xl"
            />
          </div>
        </div>
      ) : data.Images.length === 2 ? (
        <div className="flex gap-2 px-2 pt-2">
          {data.Images.map((image, index) => (
            <div key={index} className="relative w-1/2 h-64">
              <Image
                src={image}
                alt="Tiger"
                layout="fill"
                objectFit="cover"
                className="rounded-2xl"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-2 px-2 pt-2">
          <div className="relative w-3/5 h-64">
            <Image
              src={data.Images[0]}
              alt="Tiger"
              layout="fill"
              objectFit="cover"
              className="rounded-2xl"
            />
          </div>
          <div className="flex flex-col w-2/5 h-64 gap-2">
            <div className="relative w-full h-32">
              <Image
                src={data.Images[1]}
                alt="Tiger"
                layout="fill"
                objectFit="cover"
                className="rounded-2xl"
              />
            </div>
            <div className="relative w-full h-32">
              <Image
                src={data.Images[2]}
                alt="Tiger"
                layout="fill"
                objectFit="cover"
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}
      {/* End of checking */}

      <div className="relative flex flex-row space-x-4 p-4">
        <div className="text-4xl flex justify-center items-center sm:content-none">
          <FaUserCircle />
        </div>
        <div className="flex-grow">
          <div className="font-semibold">{data.GalleryName}</div>
          <div className="text-gray-400 shrink-0 min-w-max font-light">
            by {data.Photographer}
          </div>
        </div>
        <div className="text-amber-500 font-bold text-ellipsis">
          {data.Price} THB
        </div>
      </div>
    </div>
  );
};

export default GalleryComponent;
