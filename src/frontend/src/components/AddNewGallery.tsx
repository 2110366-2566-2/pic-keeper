"use client";

import { useRouter } from "next/navigation";

const AddNewGallery = () => {
  const router = useRouter();

  const handleAddClick = () => {
    // Assuming your path to the page is '/create-gallery'
    router.push("my-galleries/create-gallery");
  };

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
    </div>
  );
};

export default AddNewGallery;
