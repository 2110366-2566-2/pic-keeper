"use client";

import React, { useState } from "react";
// import { useSession } from 'next-auth/react'; // if you were using next-auth
import AddNewGallery from "@/components/AddNewGallery";
import PendingVerification from "@/components/PendingVerification";
import PhotographerVerification from "@/components/PhotographerVerification";
import VerificationFailed from "@/components/VerificationFailed";
import { PhotographerStatus, User } from "../../../../types"; // Path to your types file

const MyGalleriesPage = () => {
  // Example session data structure. Replace with actual session retrieval logic
  const [user, setUser] = useState<User>({
    // ...other user fields
    verification_status: PhotographerStatus.PhotographerNotVerifiedStatus,
  });

  // Function to update the user's verification status
  const setStatus = (newStatus: PhotographerStatus) => {
    setUser((currentUser) => ({
      ...currentUser,
      verification_status: newStatus,
    }));
    // Here you would also update the status in your backend or session
  };

  const renderContent = () => {
    switch (user.verification_status) {
      case PhotographerStatus.PhotographerNotVerifiedStatus:
        return <PhotographerVerification setStatus={setStatus} />;
      case PhotographerStatus.PhotographerPendingStatus:
        return <PendingVerification />;
      case PhotographerStatus.PhotographerRejectedStatus:
        return <VerificationFailed setStatus={setStatus} />;
      case PhotographerStatus.PhotographerVerifiedStatus:
        return <AddNewGallery />;
      default:
        return <div>Unknown status</div>;
    }
  };

  return <div className="max-w-4xl m-auto mx-4">{renderContent()}</div>;
};

export default MyGalleriesPage;
