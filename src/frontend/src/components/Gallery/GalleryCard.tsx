"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  customerGalleriesService,
  photographerGalleriesService,
  userService,
} from "@/services";
import { User } from "@/types/user";
import { Gallery } from "@/types/gallery";
import ProfileImage from "../shared/ProfileImage";
import { useRouter } from "next/navigation";

interface Props {
  galleryId: string;
}

const GalleryCard = ({ galleryId }: Props) => {
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
      setListOfImages(response.data || []);
    };

    const fetchUserInfo = async (photographerId: string) => {
      const response = await userService.getUserById(photographerId);
      if (response.data) {
        setPhotographer(response.data);
      }
      if (response.profile_picture_url) {
        setPhotographerProfile(response.profile_picture_url);
      } else {
        setPhotographerProfile("/images/nature.svg");
      }
    };

    const fetchGalleryInfo = async () => {
      const response = await photographerGalleriesService.getGallery(galleryId);
      if (response.data) {
        setGalleryInfo(response.data);
        await fetchUserInfo(response.data.photographer_id);
      }
    };

    fetchAllImages();
    fetchGalleryInfo();
  }, [galleryId]);

  const handleCardClick = () => {
    router.push(`/galleries/${galleryId}`);
  };

  const renderImages = () => {
    switch (listOfImages.length) {
      case 0:
        return (
          <div className="px-2 pt-2">
            <div className="relative w-full h-64 text-center bg-gray-300 rounded-2xl flex items-center justify-center">
              No Image
            </div>
          </div>
        );

      case 1:
        return (
          <div className="px-2 pt-2">
            <div className="relative w-full h-64 transition-transform duration-500 ease-in-out transform hover:scale-105">
              <Image
                src={listOfImages[0]}
                alt="Gallery Image"
                layout="fill"
                objectFit="cover"
                className="rounded-2xl"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex gap-2 px-2 pt-2">
            {listOfImages.map((image, index) => (
              <div
                key={index}
                className="relative w-1/2 h-64 transition-transform duration-500 ease-in-out transform hover:scale-105"
              >
                <Image
                  src={image}
                  alt="Gallery Image"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-2xl"
                />
              </div>
            ))}
          </div>
        );
      default:
        return (
          <div className="flex gap-2 px-2 pt-2 ">
            <div className="relative w-3/5 h-64 transition-transform duration-500 ease-in-out transform hover:scale-105">
              <Image
                src={listOfImages[0] || ""}
                alt="Gallery Image"
                layout="fill"
                objectFit="cover"
                className="rounded-2xl"
              />
            </div>
            <div className="flex flex-col w-2/5 h-64 gap-2">
              {listOfImages.slice(1, 3).map((image, index) => (
                <div
                  key={index}
                  className="relative w-full h-32 transition-transform duration-500 ease-in-out transform hover:scale-105"
                >
                  <Image
                    src={image}
                    alt="Gallery Image"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-2xl"
                  />
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className="rounded-xl shadow-lg bg-white overflow-hidden cursor-pointer transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl"
      onClick={handleCardClick}
    >
      {renderImages()}
      <div className="relative flex flex-row space-x-4 p-4">
        <ProfileImage src={photographerProfile} size={8} />
        <div className="flex-grow">
          <div className="font-semibold">{galleryInfo?.name}</div>
          <div className="text-gray-400 shrink-0 min-w-max font-light">
            by {photographer?.firstname} {photographer?.lastname}
          </div>
        </div>
        <div className="text-amber-500 font-bold text-ellipsis">
          {galleryInfo?.price} THB
        </div>
      </div>
    </div>
  );
};

export default GalleryCard;
