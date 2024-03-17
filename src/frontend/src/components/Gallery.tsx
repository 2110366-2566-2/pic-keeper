import React from "react";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import customerGalleriesService from "@/services/customerGalleries";
import photographerGalleryService from "@/services/photographerGalleries";
import { Gallery, User } from "@/types";
import userService from "@/services/user";

interface Props {
  galleryId: string;
  photographerId: string;
  price: number;
}

const GalleryComponent = ({ galleryId, photographerId, price }: Props) => {
  const [listOfImages, setListOfImages] = useState<string[]>([]);
  const [galleryInfo, setGalleryInfo] = useState<Gallery>();
  const [photographer, setPhotographer] = useState<User>();

  useEffect(() => {
    const fetchAllImages = async () => {
      const response = await customerGalleriesService.getPhotoUrlsListInGallery(
        galleryId
      );
      setListOfImages(response.data);
    };

    const fetchGalleryInfo = async () => {
      const response = await photographerGalleryService.getGallery(galleryId);
      setGalleryInfo(response.data);
    };

    fetchAllImages();
    fetchGalleryInfo();
  });

  useEffect(() => {
    const fetchPhotographerInfo = async () => {
      const response = await userService.getUserById(photographerId);
      setPhotographer(response.data);
    };

    fetchPhotographerInfo();
  });

  return (
    <div className="rounded-xl shadow-lg bg-white overflow-hidden">
      {/* Check how many pictures the gallery have 1,2,3? */}
      {listOfImages.length === 1 ? (
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
      ) : listOfImages.length === 2 ? (
        <div className="flex gap-2 px-2 pt-2">
          {listOfImages.map((image, index) => (
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
              src={listOfImages[0]}
              alt="Tiger"
              layout="fill"
              objectFit="cover"
              className="rounded-2xl"
            />
          </div>
          <div className="flex flex-col w-2/5 h-64 gap-2">
            <div className="relative w-full h-32">
              <Image
                src={listOfImages[1]}
                alt="Tiger"
                layout="fill"
                objectFit="cover"
                className="rounded-2xl"
              />
            </div>
            <div className="relative w-full h-32">
              <Image
                src={listOfImages[2]}
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
          <div className="font-semibold">{galleryInfo?.name}</div>
          <div className="text-gray-400 shrink-0 min-w-max font-light">
            by {photographer?.firstname} {photographer?.lastname}
          </div>
        </div>
        <div className="text-amber-500 font-bold text-ellipsis">
          {price} THB
        </div>
      </div>
    </div>
  );
};

export default GalleryComponent;
