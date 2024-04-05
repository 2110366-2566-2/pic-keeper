"use client";
import { SetStateAction, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Review } from "@/types/review";
import { Gallery } from "@/types/gallery";
import {
  userService,
  photographerGalleriesService,
  photographerReviewService,
  customerReviewService,
} from "@/services";
import { PhotographerStatus } from "@/types/user";
import { useErrorModal } from "@/hooks/useErrorModal";
import GalleryPreview from "./GalleryPreview";
import ProfileUserInfo from "./ProfileUserInfo";
import ProfileUserHeader from "./ProfileUserHeader";
import ReviewPreview from "./ReviewPreview";

const Home = ({ params }: { params: { userId: string } }) => {
  const { data: session } = useSession();
  const [profilePicture, setProfilePicture] = useState("");
  const [listOfGalleries, setListOfGalleries] = useState<Gallery[]>([]);
  const [listOfReview, setListOfReview] = useState<Review[]>([]);
  const showError = useErrorModal();

  useEffect(() => {
    const fetchAllGalleries = async () => {
      try {
        const response = await photographerGalleriesService.getAllMyGalleries();
        if (response.data) {
          setListOfGalleries(response.data);
        }
      } catch (error) {
        showError(error);
      }
    };

    if (
      session?.user.data?.verification_status === PhotographerStatus.Verified
    ) {
      fetchAllGalleries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.userId]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await userService.getUserById(params.userId);
        if (response.data) {
          setProfilePicture(response.profile_picture_url ?? "");
          console.log(response.data.profile_picture_key);
        }
      } catch (error) {
        showError(error);
      }
    };

    fetchUserInfo();
  }, [params.userId, session]);

  useEffect(() => {
    const fetchAllReview = async () => {
      try {
        let response;
        if (
          session?.user?.data?.verification_status ===
          PhotographerStatus.Verified
        ) {
          response = await photographerReviewService.listReceivedReviews();
        } else {
          response = await customerReviewService.myReviews();
        }
        if (response?.data) {
          setListOfReview(response.data);
        }
      } catch (error) {
        showError(error);
      }
    };

    fetchAllReview();
  }, [session]);

  return (
    <main className="m-4 sm:m-8 space-y-6">
      <div className="text-2xl font-semibold px-5">Profile</div>
      <ProfileUserHeader
        session={session}
        profilePicture={profilePicture}
        userId={params.userId}
      />
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
        <ProfileUserInfo session={session} />
        <div className="flex flex-col w-full space-y-4">
          {session?.user.data?.verification_status ===
            PhotographerStatus.Verified && (
            <GalleryPreview listOfGalleries={listOfGalleries} />
          )}
          {listOfReview.length > 0 && (
            <ReviewPreview listOfReview={listOfReview} />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
