import React, { useState } from "react";
import { photographerGalleriesService } from "@/services";
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  closeModal: () => void;
  galleryId: string; // Assuming you have a galleryId to delete
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  closeModal,
  galleryId,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showChangesSaved, setShowChangesSaved] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    closeModal();
    try {
      await photographerGalleriesService.deleteGallery(galleryId);
      // If successful, show the changes saved message
      setShowChangesSaved(true);
      setTimeout(() => {
        setShowChangesSaved(false);
        closeModal(); // Close the modal after showing the changes saved message
      }, 1000); // Adjust time as necessary
    } catch (error) {
      console.error("Failed to delete gallery:", error);
      // Handle error (e.g., show error message to the user)
    }
    setIsDeleting(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 m-4">
        <div className="flex justify-center items-center text-red-600 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19.5 6L4.5 6M14.5 11V17M9.5 11V17M20.5 6V18C20.5 19.1046 19.6046 20 18.5 20H5.5C4.39543 20 3.5 19.1046 3.5 18V6H20.5ZM17.5 6V4C17.5 2.89543 16.6046 2 15.5 2H8.5C7.39543 2 6.5 2.89543 6.5 4V6H17.5Z"
            />
          </svg>
        </div>
        <h2 className="text-2xl text-center font-bold text-gray-700">
          Are you sure?
        </h2>
        <p className="text-gray-500 text-center mt-4">
          This will delete your gallery from PicKeeper.
        </p>
        <div className="mt-8 flex justify-center items-center space-x-3">
          <button
            className="px-4 py-2 text-gray-500 rounded hover:text-gray-400"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
