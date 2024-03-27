"use client";

import React, { useEffect, useState, useMemo } from "react";
import { PhotographerStatus, User } from "@/types/user";
import userService from "@/services/user";
import {
  PhotographerVerification,
  PendingVerification,
  VerificationFailed,
  AddNewGallery,
} from "@/components/Settings/MyGalleries";
import { useSession } from "next-auth/react";

const MyGalleriesPage = () => {
  const { data: session } = useSession();

  const content = useMemo(() => {
    switch (session?.user.data?.verification_status) {
      case PhotographerStatus.NotVerified:
        return <PhotographerVerification />;
      case PhotographerStatus.Pending:
        return <PendingVerification />;
      case PhotographerStatus.Rejected:
        return <VerificationFailed />;
      case PhotographerStatus.Verified:
        return <AddNewGallery />;
      default:
        return <div>Unknown status</div>;
    }
  }, [session]);

  return <div className="m-auto mx-4">{content}</div>;
};

export default MyGalleriesPage;
