"use client";
import customerGalleriesService from "@/services/customerGalleries";
import photographerGalleriesService from "@/services/photographerGalleries";
import { Gallery } from "@/types/gallery";
import { useEffect, useState } from "react";
import ImageViewer from "./ImageViewer";
import ProfileImage from "../shared/ProfileImage";
import { User } from "@/types/user";
import userService from "@/services/user";

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
    <div className="mx-auto rounded-lg shadow-lg p-4 grid grid-cols-4 gap-8">
      <ImageViewer imageUrls={imageUrls} />

      <div className="col-span-2 flex-1 space-y-4">
        <h1 className="text-title">{gallery.name}</h1>
        <div className="flex self-stretch gap-4">
          <ProfileImage src={profilePicture} size={14} />
          <div>
            <h2 className="text-md tracking-wide">
              {photographer.firstname} {photographer.lastname}
            </h2>
            <h3 className="text-standard">{photographer.gender}</h3>
          </div>
        </div>
        <div>
          <h2 className="text-md tracking-wide">Description</h2>
          <div className="space-y-2">
            <p className="text-base text-gray-900">{gallery.description}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between">
            <h2>Package</h2>
            <h2>${gallery.price}</h2>
          </div>
          <div className="space-y-2">
            <h4>{gallery.hours} hours photography event</h4>
            <h4>{gallery.location}</h4>
            <h4>{gallery.delivery_time} days delivery</h4>
          </div>
          <div>
            {gallery.included.map((include) => (
              <li key={include}>{include}</li>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MyGallery;
