"use clinet";

import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import customerGalleriesService from "@/services/customerGalleries";
import photographerGalleryService from "@/services/photographerGalleries";
import { User } from "@/types/user";
import { Gallery } from "@/types/gallery";
import userService from "@/services/user";
import ProfileImage from "../shared/ProfileImage";
import { useRouter } from "next/navigation";

interface Props {
  galleryId: string;
  photographerId: string;
  price: number;
}

const GalleryCard = ({ galleryId, photographerId, price }: Props) => {
  const [listOfImages, setListOfImages] = useState<string[]>([]);
  const [galleryInfo, setGalleryInfo] = useState<Gallery>();
  const [photographer, setPhotographer] = useState<User>();
  const [photographerProfile, setPhotographerProfile] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchAllImages = async () => {
      const response = await customerGalleriesService.getPhotoUrlsListInGallery(
        galleryId
      );
      if (response.data) {
        setListOfImages(response.data);
        console.log(response.data);
      } else {
        setListOfImages([]);
      }
    };

    const fetchGalleryInfo = async () => {
      const response = await photographerGalleryService.getGallery(galleryId);
      if (response.data) setGalleryInfo(response.data);
    };

    fetchAllImages();
    fetchGalleryInfo();
  }, [galleryId]);

  useEffect(() => {
    const getUserById = async () => {
      const response = await userService.getUserById(photographerId);
      if (response.data) {
        setPhotographer(response.data);
        setPhotographerProfile(response.profile_picture_url);
      }
    };
    getUserById();
  }, [photographerId]);

  const handleCardClick = () => {
    router.push(`/galleries/${galleryId}`);
  };

  return (
    <div
      className="rounded-xl shadow-lg bg-white overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      {listOfImages.length === 1 ? (
        <div className="px-2 pt-2">
          <div className="relative w-full h-64">
            <Image
              src={listOfImages[0]}
              alt="pic"
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
      <div className="relative flex flex-row space-x-4 p-4">
        <ProfileImage src={photographerProfile} size={8} />
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

export default GalleryCard;
