import React, { useRef, useState } from "react";
import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { HiOutlinePlusSm } from "react-icons/hi";
import { classNames } from "@/utils/list";
import { FileWithPreview } from "@/types/gallery";

interface Props {
  files: FileWithPreview[];
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[]>>;
}

const ImageViewerWithUploader = ({ files, setFiles }: Props) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(-1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const preview = URL.createObjectURL(file);
      const updatedFiles = [{ file, preview }, ...files];
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
              onClick={() => fileInputRef.current?.click()}
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
          onClick={() => fileInputRef.current?.click()}
        >
          <HiOutlinePlusSm className="text-4xl text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default ImageViewerWithUploader;
