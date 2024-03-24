"use client";

import MyGallery from "@/components/Gallery/MyGallery";
import { useRouter } from "next/navigation";

const AddNewGallery = () => {
  const router = useRouter();

  const handleAddClick = () => {
    // Assuming your path to the page is '/create-gallery'
    router.push("/galleries/create-gallery");
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-900/10 pb-4">
        <div className="flex flex-col justify-between">
          <div className="flex mt-10 items-center justify-between gap-x-6">
            <h2 className="text-title">My Galleries</h2>
            <button
              type="button" // Change to 'button' since this is not a submit action
              onClick={handleAddClick}
              className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              + Add
            </button>
          </div>
          <MyGallery />
        </div>
      </div>
    </div>
  );
};

export default AddNewGallery;
