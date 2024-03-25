"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import { PhotographerStatus } from "@/types/user";
import photographerGalleriesService from "@/services/photographerGalleries";
import { useErrorModal } from "@/hooks/useErrorModal";
import { Gallery } from "@/types/gallery";
import GalleryCard from "@/components/Gallery/GalleryCard";

const AddNewGallery = () => {
  const router = useRouter();
  const showError = useErrorModal();
  const [listOfGalleries, setListOfGalleries] = useState<Gallery[]>([]);

  const handleAddClick = () => {
    router.push("/galleries/create-gallery");
  };

  useEffect(() => {
    const fetchAllGalleries = async () => {
      try {
        const response = await photographerGalleriesService.getAllMyGalleries();
        if (response.data) {
          setListOfGalleries(response.data);
        }
      } catch (error) {
        showError(error);
      }
    };
    fetchAllGalleries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-900/10 pb-4">
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          <div className="sm:col-span-2 flex justify-between">
            <h2 className="text-title">My Galleries</h2>
            <div className="flex items-center justify-end gap-x-6">
              <button
                type="button" // Change to 'button' since this is not a submit action
                onClick={handleAddClick}
                className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                + Add
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* GALLERIES */}
      <div className="grid grid-cols-auto-fill-300 2xl:grid-cols-auto-fill-400 gap-4 p-4">
        {/* GALLERY COMPONENT */}
        {listOfGalleries &&
          listOfGalleries.map((Gallery, index) => (
            <GalleryCard
              key={index}
              galleryId={Gallery.id}
              photographerId={Gallery.photographer_id}
              price={Gallery.price}
            />
          ))}
      </div>
    </div>
  );
};

export default AddNewGallery;
