"use client";

import React, { useEffect, useState, useMemo } from "react";
import { PhotographerStatus, User } from "@/types/user";
import userService from "@/services/user";
import {
  PhotographerVerification,
  PendingVerification,
  VerificationFailed,
  AddNewGallery,
} from "@/components/User/MyGalleries";

const MyGalleriesPage = () => {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await userService.getMyUserInfo();
        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error(error);
        setError("Failed to fetch user info. Please Login");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const content = useMemo(() => {
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    switch (user?.verification_status) {
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
  }, [isLoading, error, user]);

  return <div className="max-w-4xl m-auto mx-4">{content}</div>;
};

export default MyGalleriesPage;
