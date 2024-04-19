"use client";

import React, { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { GrLocation } from "react-icons/gr";
import photographerGalleriesService from "@/services/photographerGalleries";
import useApiWithAuth from "@/hooks/useApiWithAuth";
import { useRouter } from "next/navigation";
import { FileWithPreview } from "@/types/gallery";
import ImageViewerWithUploader from "./ImageViewerWithUploader";
import { useErrorModal } from "@/hooks/useErrorModal";

const CreateGallery = () => {
  const router = useRouter();
  const axiosAuth = useApiWithAuth();
  const showError = useErrorModal();

  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const [additionalInputs, setAdditionalInputs] = useState<number[]>([]);
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [price, setPrice] = useState<number | string>("");
  const [hours, setHours] = useState<number | string>("");
  const [description, setDescription] = useState<string>("");
  const [deliveryTime, setDeliveryTime] = useState<number | string>("");
  const [included, setIncluded] = useState<string[]>([]);

  const handleAddInput = () => {
    setAdditionalInputs((currentInputs) => [
      ...currentInputs,
      currentInputs.length,
    ]);
    setIncluded((currentIncluded) => [...currentIncluded, ""]);
  };

  const handleIncludedChange = (index: number, value: string) => {
    const updatedIncluded = [...included];
    updatedIncluded[index] = value;
    setIncluded(updatedIncluded);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newGalleryData = {
      name,
      location,
      price: Number(price),
      hours: Number(hours),
      description,
      delivery_time: Number(deliveryTime),
      included,
    };
    try {
      const createdGallery = await photographerGalleriesService.createGallery(
        newGalleryData
      );
      if (createdGallery.data) {4
        await Promise.all(
          files.map((file) =>
            photographerGalleriesService.uploadPhotoToGallery(
              axiosAuth,
              createdGallery.data!.id,
              file.file
            )
          )
        );
        router.push("/settings/my-galleries");
      }
    } catch (error) {
      showError(error, "An error occurred while creating the gallery.");
    }
  };

  return (
    <div className="mx-auto rounded-lg shadow-lg p-4 grid grid-cols-4 gap-8">
      <ImageViewerWithUploader files={files} setFiles={setFiles} />

      <form className="col-span-2 flex-1 " onSubmit={handleSubmit}>
        <div className="overflow-y-scroll h-[62vh]">
          <div className="flex flex-col overflow-y-auto gap-2">
            <div className="flex flex-col">
              <label htmlFor="gallery" className="label-normal">
                Gallery name
              </label>
              <input
                id="gallery"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="description" className="label-normal">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label htmlFor="hours" className="label-normal">
                  Hours
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="hours"
                    type="number"
                    className="form-input"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                  />
                  <span className="label-normal">Hrs</span>
                </div>
              </div>
              <div className="flex-grow">
                <label htmlFor="location" className="label-normal">
                  Location
                </label>
                <div className="relative">
                  <input
                    id="location"
                    type="text"
                    className="form-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <GrLocation />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="deliveryTime" className="label-normal">
                  Delivery time
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="deliveryTime"
                    type="number"
                    className="form-input"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                  />
                  <span className="label-normal">Days</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="mr-2">What includes in this package</span>
            </div>
            {additionalInputs.map((index) => (
              <div key={index} className="flex flex-col mb-2">
                <input
                  id={`included-${index}`}
                  type="text"
                  className="form-input"
                  value={included[index] || ""}
                  onChange={(e) => handleIncludedChange(index, e.target.value)}
                />
              </div>
            ))}
            {/* Click to add button */}
            <button
              type="button"
              className="text-yellow-600 flex items-center"
              onClick={handleAddInput}
            >
              <IoIosAdd className="w-8 h-auto" />
              Click to add
            </button>

            <div className="flex items-center">
              <div className="flex flex-col ">
                <label id="price" className="label-normal">
                  Price
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="form-input"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <span className="label-normal">THB</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button className="btn-cancel mt-4 px-2">Cancel</button>
          <button type="submit" className="btn-primary mt-4 px-5">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGallery;
