"use client";

import DeleteConfirmationModal from "@/components/Miscellaneouos/DeleteConfirmationModal";
import PhoneNumberModal from "@/components/Miscellaneouos/PhoneNumberModal";
import ShareLinkModal from "@/components/Miscellaneouos/ShareLinkModal";
import ChangesSavedModal from "@/components/Miscellaneouos/ChangesSavedModal";
import React, { useState } from "react";
import PhotographerVerificationModal from "@/components/Admin/Verification/PhotographerVerificationModal";

const Home = () => {
  // States for each modal's visibility
  const [isPhoneNumberModalOpen, setIsPhoneNumberModalOpen] = useState(false);
  const [isShareLinkModalOpen, setIsShareLinkModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);
  const [isChangesSavedModalOpen, setIsChangesSavedModalOpen] = useState(false);
  const [
    isPhotographerVerificationModalOpen,
    setIsPhotographerVerificationModalOpen,
  ] = useState(false);

  // Example data that could be loaded from an API or other sources
  const phoneNumber = "0818295425";
  const shareLink = "https://pickeeper.com/username/galleryname";

  // Functions to open the modals
  const openPhoneNumberModal = () => setIsPhoneNumberModalOpen(true);
  const openShareLinkModal = () => setIsShareLinkModalOpen(true);
  const openDeleteConfirmationModal = () =>
    setIsDeleteConfirmationModalOpen(true);

  // Function to show "Changes Saved" confirmation
  const showChangesSaved = () => {
    setIsChangesSavedModalOpen(true);
  };

  // Functions to close the modals
  const closePhoneNumberModal = () => setIsPhoneNumberModalOpen(false);
  const closeShareLinkModal = () => setIsShareLinkModalOpen(false);
  const closeDeleteConfirmationModal = () =>
    setIsDeleteConfirmationModalOpen(false);

  // Function to open the PhotographerVerificationModal
  const openPhotographerVerificationModal = () =>
    setIsPhotographerVerificationModalOpen(true);

  // Function to close the PhotographerVerificationModal
  const closePhotographerVerificationModal = () =>
    setIsPhotographerVerificationModalOpen(false);

  // Function to handle delete confirmation action
  const handleDeleteConfirm = () => {
    // Perform delete action, such as making an API call
    // For now, just close the modal
    closeDeleteConfirmationModal();
    console.log("Gallery deleted");
  };

  return (
    <div>
      {/* Buttons to trigger the opening of the modals */}
      <button
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mr-4"
        onClick={openPhoneNumberModal}
      >
        Show Phone Number
      </button>

      <button
        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 mr-4"
        onClick={openShareLinkModal}
      >
        Show Share Link
      </button>

      <button
        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
        onClick={openDeleteConfirmationModal}
      >
        Delete Gallery
      </button>

      <button
        className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
        onClick={showChangesSaved}
      >
        Save Changes
      </button>

      <button
        className="bg-teal-500 text-white p-2 rounded hover:bg-teal-600"
        onClick={openPhotographerVerificationModal}
      >
        Verify Photographer
      </button>

      {/* Modals */}
      <PhoneNumberModal
        isOpen={isPhoneNumberModalOpen}
        closeModal={closePhoneNumberModal}
        content={{ phoneNumber }}
      />

      <ShareLinkModal
        isOpen={isShareLinkModalOpen}
        closeModal={closeShareLinkModal}
        content={{ shareLink }}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteConfirmationModalOpen}
        closeModal={closeDeleteConfirmationModal}
        onDeleteConfirm={handleDeleteConfirm}
      />

      <ChangesSavedModal
        isOpen={isChangesSavedModalOpen}
        closeChangesSavedModal={() => setIsChangesSavedModalOpen(false)}
      />

      <PhotographerVerificationModal
        isOpen={isPhotographerVerificationModalOpen}
        closeModal={closePhotographerVerificationModal}
        // You would pass the actual photographer data here
        photographer={{
          name: "Punnawich Yiamsombat",
          username: "09893",
          createdDate: "17/02/2024",
          idNumber: "1103949863397",
          additionalInfo: "Additional Information about the Photographer Lorem",
          idCardImage: "/images/signup.png",
        }}
      />
    </div>
  );
};
export default Home;
