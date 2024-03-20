"use client";
import customerGalleriesService from "@/services/customerGalleries";
import photographerGalleriesService from "@/services/photographerGalleries";
import { Gallery } from "@/types/gallery";
import { useEffect, useState } from "react";
import ImageViewer from "./ImageViewer";
import ProfileImage from "../shared/ProfileImage";
import { User } from "@/types/user";
import userService from "@/services/user";
import { IoIosCamera, IoIosLocate, IoIosTime } from "react-icons/io";
import { IoLocateSharp, IoLocation, IoLocationSharp } from "react-icons/io5";

interface Props {
  galleryId: string;
}

const MyGallery = ({ galleryId }: Props) => {
  const [gallery, setGallery] = useState<Gallery>();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [photographer, setPhotographer] = useState<User>();
  const [profilePicture, setProfilePicture] = useState<string>("");
  useEffect(() => {
    (async () => {
      try {
        const galleryResponse = await photographerGalleriesService.getGallery(
          galleryId
        );
        if (galleryResponse.data) {
          setGallery(galleryResponse.data);
          const photographerResponse = await userService.getUserById(
            galleryResponse.data.photographer_id
          );
          if (photographerResponse.data) {
            setPhotographer(photographerResponse.data);
            setProfilePicture(photographerResponse.profile_picture_url);
          }
        }

        const imageResponse =
          await customerGalleriesService.getPhotoUrlsListInGallery(galleryId);
        if (imageResponse.data) {
          setImageUrls(imageResponse.data);
        }
      } catch (error) {}
    })();
  }, [galleryId]);

  if (!gallery || !photographer) {
    return <div>No gallery or photographer specified</div>;
  }
  return (
    <div className="mx-auto rounded-lg shadow-lg p-6 grid grid-cols-1 md:grid-cols-4 gap-8 bg-white text-gray-800">
      <ImageViewer imageUrls={imageUrls} />

      <div className="md:col-span-2 space-y-6 flex flex-col">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
          {gallery.name}
        </h1>
        <div className="flex items-center gap-4">
          <ProfileImage src={profilePicture} size={16} />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {photographer.firstname} {photographer.lastname}
            </h2>
            <h3 className="text-md text-gray-600">{photographer.gender}</h3>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Description</h2>
          <p className="text-base text-gray-700 leading-relaxed">
            {gallery.description}
          </p>
        </div>
        <div className="space-y-4 rounded-xl ring-1 p-4 ring-gray-300 max-h-64 overflow-y-scroll">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Package</h2>
            <p className="text-lg font-bold text-amber-600">
              {gallery.price} THB
            </p>
          </div>
          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-2 items-center">
              <IoIosCamera className="w-6 h-6" />
              <span>{gallery.hours} hours photography event</span>
            </li>
            <li className="flex gap-2 items-center">
              <IoLocationSharp className="w-6 h-6" />
              <span>{gallery.location}</span>
            </li>
            <li className="flex gap-2 items-center">
              <IoIosTime className="w-6 h-6" />
              <span>{gallery.delivery_time} days delivery</span>
            </li>
            {gallery.included.map((include, index) => (
              <li key={index} className="list-disc list-inside text-gray-400">
                <span className="text-gray-600">{include}</span>
              </li>
            ))}
          </ul>
        </div>
        <button className="self-end btn-primary px-16">Chat</button>
      </div>
    </div>
  );
};
export default MyGallery;
