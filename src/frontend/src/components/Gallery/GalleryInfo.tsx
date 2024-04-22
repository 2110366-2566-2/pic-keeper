"use client";
import { Gallery } from "@/types/gallery";
import { useEffect, useState } from "react";
import ReviewPreview from "@/components/User/ProfileView/ReviewPreview";
import ImageViewer from "./ImageViewer";
import ProfileImage from "../shared/ProfileImage";
import { PhotographerStatus, User } from "@/types/user";
import { Review } from "@/types/review";
import {
  userService,
  roomService,
  customerGalleriesService,
  photographerGalleriesService,
  photographerReviewService,
  customerReviewService,
} from "@/services";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MdModeEdit } from "react-icons/md";
import { useModal } from "@/context/ModalContext";
import { useErrorModal } from "@/hooks/useErrorModal";
import PackageInfo from "./PackageInfo";
import DeleteConfirmationModal from "../Miscellaneouos/DeleteConfirmationModal";

interface Props {
  galleryId: string;
}

const GalleryInfo = ({ galleryId }: Props) => {
  const [gallery, setGallery] = useState<Gallery>();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [photographer, setPhotographer] = useState<User>();
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [listOfReview, setListOfReview] = useState<Review[]>([]);

  const { data: session } = useSession();
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const showError = useErrorModal();

  useEffect(() => {
    (async () => {
      try {
        const galleryResponse = await photographerGalleriesService.getGallery(
          galleryId
        );
        if (galleryResponse.data) {
          setGallery(galleryResponse.data);
          const photographerResponse = await userService.getUserById(
            galleryResponse.data.photographer_id
          );
          if (photographerResponse.data) {
            setPhotographer(photographerResponse.data);
            setProfilePicture(
              photographerResponse.profile_picture_url || "/images/nature.svg"
            );
          }
        }

        const imageResponse =
          await customerGalleriesService.getPhotoUrlsListInGallery(galleryId);
        if (imageResponse.data) {
          setImageUrls(imageResponse.data);
        }
      } catch (error) {
        showError(error, "Failed to fetch gallery info");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [galleryId]);

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

  const handleDeleteClick = () => {
    // Instead of using the `openModal` function, we're now setting the state to open the DeleteConfirmationModal
    setDeleteModalOpen(true);
  };

  // Handler that will be passed to DeleteConfirmationModal
  // to close the modal and potentially handle other logic after deletion
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    // Any additional logic after closing the modal
  };

  const deleteGallery = async () => {
    try {
      await photographerGalleriesService.deleteGallery(galleryId);
      closeModal();
      router.push("/");
      closeModal();
    } catch (error) {
      showError(error, "An error occurred while deleting gallery");
    }
  };

  const handleEditClick = async () => {
    router.push(`/galleries/${galleryId}/edit`);
  };

  if (!gallery || !photographer) {
    return <div>No gallery or photographer specified</div>;
  }

  const handleChatClick = async () => {
    try {
      const response = await roomService.getRoomOfUserByGalleryId(galleryId);
      if (response.exist) {
        router.push(`/chat/${response.data?.id}`);
        return;
      }
      const createdRoom = await roomService.createRoom({
        member_ids: [gallery.photographer_id],
        gallery_id: galleryId,
      });
      if (createdRoom.data) {
        router.push(`/chat/${createdRoom.data.id}`);
        return;
      }

      showError(new Error("there is a problem with navigation to the chat"));
    } catch (error) {
      showError(error);
    }
  };
  return (
    <>
      <div className="mx-auto rounded-lg shadow-lg p-6 grid grid-cols-1 md:grid-cols-4 gap-8 bg-white text-gray-800">
        <ImageViewer imageUrls={imageUrls} />

        <div className="md:col-span-2 space-y-6 flex flex-col justify-between">
          <div className="space-y-6 flex flex-col">
            <div className="flex justify-between">
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {gallery.name}
              </h1>
              {/* {photographer.id === session?.user.data?.id && (
                <button
                  className="self-end btn-primary px-6 flex items-center gap-2"
                  onClick={handleEditClick}
                >
                  <MdModeEdit className="inline" />
                  Edit
                </button>
              )} */}
            </div>
            <div className="flex items-center gap-4">
              <ProfileImage src={profilePicture} size={16} />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {photographer.firstname} {photographer.lastname}
                </h2>
                <h3 className="text-md text-gray-600">{photographer.gender}</h3>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Description
              </h2>
              <p className="text-base text-gray-700 leading-relaxed">
                {gallery.description}
              </p>
            </div>
            <div className="rounded-xl ring-1 ring-gray-300 max-h-64 overflow-y-scroll">
              <PackageInfo gallery={gallery} />
            </div>
            <ReviewPreview listOfReview={listOfReview} />
          </div>
          <div className="flex justify-end">
            {session && photographer.id !== session?.user.data?.id && (
              <button
                className="self-end btn-primary px-16"
                onClick={handleChatClick}
              >
                Chat
              </button>
            )}
            {photographer.id === session?.user.data?.id && (
              <button
                className="self-end btn-danger px-16 "
                onClick={handleDeleteClick}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          closeModal={closeDeleteModal}
          galleryId={galleryId}
          // Optionally, pass the onDeleteConfirm if you want to handle additional logic after confirmation
        />
      )}
    </>
  );
};
export default GalleryInfo;
