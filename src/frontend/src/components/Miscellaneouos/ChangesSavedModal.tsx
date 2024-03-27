import React, { useState, useEffect } from "react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onDeleteConfirm: () => void; // Function to call when delete is confirmed
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  closeModal,
  onDeleteConfirm,
}) => {
  const [showChangesSaved, setShowChangesSaved] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showChangesSaved) {
      // Set a timeout to close the changes saved notification after 1 second
      timer = setTimeout(() => {
        setShowChangesSaved(false);
        closeModal(); // Assuming you want to close the entire modal after showing changes saved
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [showChangesSaved, closeModal]);

  const handleDelete = () => {
    onDeleteConfirm(); // Perform delete operation
    setShowChangesSaved(true); // Show changes saved notification
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {showChangesSaved ? (
        // Changes Saved Notification
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-10 m-8 shadow-lg">
            <div className="flex flex-col items-center">
              {/* Checkmark icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l1.5 1.5a1 1 0 001.414 0l3.5-3.5z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-2xl my-2 text-center font-bold text-gray-700">
                Changes Saved
              </h2>
            </div>
          </div>
        </div>
      ) : (
        // Delete Confirmation Modal
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          {/* ... rest of your existing delete confirmation modal code ... */}
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
      )}
    </>
  );
};

export default DeleteConfirmationModal;
