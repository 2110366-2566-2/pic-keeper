"use client";

import React, { useEffect } from "react";

interface ChangesSavedModalProps {
  isOpen: boolean;
  closeChangesSavedModal: () => void;
}

const ChangesSavedModal: React.FC<ChangesSavedModalProps> = ({
  isOpen,
  closeChangesSavedModal,
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      // Set a timeout to close the modal after 2 seconds
      timer = setTimeout(() => {
        closeChangesSavedModal();
      }, 1300);
    }
    // Cleanup the timer when the component unmounts or when isOpen changes
    return () => clearTimeout(timer);
  }, [isOpen, closeChangesSavedModal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-transparent flex items-center justify-center">
        <div className="bg-white rounded-2xl p-10 m-8 shadow-lg">
          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-orange-500"
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
    </div>
  );
};

export default ChangesSavedModal;
