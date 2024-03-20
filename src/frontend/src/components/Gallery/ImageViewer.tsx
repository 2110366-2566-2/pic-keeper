import React, { useState } from "react";
import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { classNames } from "@/utils/list";

interface Props {
  imageUrls: string[];
}

const ImageViewer = ({ imageUrls }: Props) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const navigateImages = (direction: "left" | "right") => {
    setCurrentImageIndex((prevIndex) => {
      if (direction === "left") {
        return prevIndex > 0 ? prevIndex - 1 : imageUrls.length - 1;
      } else {
        return prevIndex < imageUrls.length - 1 ? prevIndex + 1 : 0;
      }
    });
  };

  return (
    <div className="col-span-2 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <button
          className="text-black text-6xl"
          onClick={() => navigateImages("left")}
        >
          <IoIosArrowBack />
        </button>

        <div className="flex flex-col items-center justify-center rounded-lg relative w-72 h-96">
          <Image
            src={imageUrls[currentImageIndex]}
            alt="Selected Image"
            fill={true}
            className="object-cover rounded-2xl"
          />
        </div>

        <button
          className="text-black text-6xl"
          onClick={() => navigateImages("right")}
        >
          <IoIosArrowForward />
        </button>
      </div>

      <div className="flex overflow-x-auto space-x-4 p-1 scrollbar-hide">
        {imageUrls.map((imgUrl, index) => (
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
              src={imgUrl}
              alt={`Selected Image ${index + 1}`}
              layout="fill"
              objectFit="cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageViewer;
