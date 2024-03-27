import React from "react";

interface ShareLinkModalProps {
  isOpen: boolean;
  closeModal: () => void;
  content: {
    shareLink: string;
  };
}

export default function ShareLinkModal({
  isOpen,
  closeModal,
  content,
}: ShareLinkModalProps) {
  if (!isOpen || !content) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white rounded-2xl max-w-md w-full max-h-[500px] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center mb-4 justify-center">
            <h3 className="text-xl font-semibold text-gray-600">Share link</h3>
          </div>
          {/* Wrap the content in a div with a max width to ensure it doesn't overflow */}
          <div className="flex flex-col items-start p-4 rounded-lg shadow space-y-4 bg-gray-200 w-full">
            <div className="overflow-hidden overflow-ellipsis whitespace-nowrap w-full">
              <p className="text-lg font-medium text-gray-600">
                {content.shareLink}
              </p>
            </div>
          </div>
          <div className="flex justify-end items-center space-x-3">
            <button
              className="px-4 py-2 mt-4 text-gray-500 rounded hover:text-gray-400"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="rounded-md bg-amber-500 px-4 mt-4 py-2 text-m font-medium text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              onClick={() => {
                navigator.clipboard.writeText(content.shareLink);
                // Provide feedback that the link was copied
              }}
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
