"use client";

import adminService from "@/services/admin";
import Image from "next/image";

import React, { useState, useEffect, useRef } from "react";

import { VerificationTicket } from "@/types/verification";

interface PhotographerVerificationModalProps {
  photographer: VerificationTicket;
  isOpen: boolean;
  closeModal: () => void;
}

const PhotographerVerificationModal = ({
  photographer,
  isOpen,
  closeModal,
}: PhotographerVerificationModalProps) => {
  const [status, setStatus] = useState("Open");
  const [isImagePreviewOpen, setImagePreviewOpen] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleImageClick = () => {
    setImagePreviewOpen(true);
  };

  const closeImagePreview = () => {
    setImagePreviewOpen(false);
  };

  const handleApprove = async () => {
    try {
      await adminService.verify(photographer.user.id); // Use username or another unique identifier
      setStatus("Approved");
      closeModal();
      // Add any other actions or notifications you'd like to perform post-approval
    } catch (error) {
      console.error("Error approving photographer:", error);
      // Handle errors, perhaps show a notification
    }
  };

  const handleDecline = async () => {
    try {
      await adminService.reject(photographer.user.id); // Use username or another unique identifier
      setStatus("Rejected");
      closeModal();
      // Add any other actions or notifications you'd like to perform post-rejection
    } catch (error) {
      console.error("Error rejecting photographer:", error);
      // Handle errors, perhaps show a notification
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (backdropRef.current && backdropRef.current === event.target) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
    >
      <div
        ref={modalContentRef}
        className="bg-white rounded-2xl shadow-xl max-w-4xl mx-auto relative"
      >
        {/* Header */}
        <h2 className="text-2xl mt-4 ml-6 font-bold text-gray-700">
          Photographer Verification
        </h2>
        <div
          className={`px-6 py-2 flex justify-between items-center border-b `}
        >
          <div>
            <h3 className="text-lg font-semibold text-stone-400">
              #{photographer.user.username}
            </h3>

            <p className="text-sm font-semibold text-gray-700">
              Name : {photographer.user.firstname} {photographer.user.lastname}
            </p>
            <p className="text-sm font-semibold text-gray-700">
              Created Date : {photographer.created_at}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-s font-semibold ${
              status === "Open"
                ? "bg-green-200 text-green-800"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Body */}
        <div className="p-6 flex">
          <div className="flex-grow space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-700">ID number :</p>
              <p className="p-2 bg-gray-200 rounded border">
                {photographer.id_card_number}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Additional information :
              </p>
              <p className="p-2 bg-gray-200 rounded border">
                {photographer.additional_desc}
              </p>
            </div>
          </div>
          <div
            className="w-40 h-40 ml-4 cursor-pointer"
            onClick={handleImageClick}
          >
            <img
              src={photographer.id_card_picture_url}
              alt="ID Card"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
          {isImagePreviewOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-20">
              <div className="relative">
                <button
                  onClick={closeImagePreview}
                  className="absolute top-0 right-0 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-opacity-50 z-30"
                  aria-label="Close image preview"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <img
                  src={photographer.id_card_picture_url}
                  alt="ID Card Preview"
                  className="max-w-xs max-h-full rounded-lg shadow-lg"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-start space-x-5">
          {status === "Open" && (
            <>
              <button
                onClick={handleDecline}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
              >
                Decline
              </button>
              <button
                onClick={handleApprove}
                className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-500"
              >
                Approve
              </button>
            </>
          )}
          {status === "Closed" && (
            <button
              onClick={closeModal}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotographerVerificationModal;
