"use client";
import customerGalleriesService from "@/services/customerGalleries";
import photographerGalleriesService from "@/services/photographerGalleries";
import { Gallery } from "@/types/gallery";
import { useEffect, useState } from "react";
import ImageViewer from "./ImageViewer";

interface Props {
  galleryId: string;
}

const MyGallery = ({ galleryId }: Props) => {
  const [gallery, setGallery] = useState<Gallery>();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const galleryResponse = await photographerGalleriesService.getGallery(
          galleryId
        );
        if (galleryResponse.data) {
          setGallery(galleryResponse.data);
        }

        const imageResponse =
          await customerGalleriesService.getPhotoUrlsListInGallery(galleryId);
        if (imageResponse.data) {
          setImageUrls(imageResponse.data);
        }
      } catch (error) {}
    })();
  });

  return (
    <div className="mx-auto rounded-lg shadow-lg p-4 grid grid-cols-4 gap-8">
      <ImageViewer imageUrls={imageUrls} />

      <form className="col-span-2 flex-1 "></form>
    </div>
  );
};
export default MyGallery;
