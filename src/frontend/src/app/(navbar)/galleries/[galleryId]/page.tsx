'use client'
import GalleryInfo from "@/components/Gallery/GalleryInfo";
import { useErrorModal } from "@/hooks/useErrorModal";
import { Review } from "@/types/review";
import { useState } from "react";
import ReviewPreview from "@/components/User/ProfileView/ReviewPreview";

const Home = ({ params }: { params: { galleryId: string } }) => {
  const [listOfReview, setListOfReview] = useState<Review[]>([]);
  const showError = useErrorModal();

  // useEffect(() => {
  //   const fetchAllReview = async () => {
  //     try {
  //       const response = await photographerReviewService.listReceivedReviews();
  //       if (response?.data) {
  //         setListOfReview(response.data);
  //       }
  //     } catch (error) {
  //       showError(error);
  //     }
  //   };

  //   fetchAllReview();
  // }, []);

  if (!params.galleryId) {
    return <div>No room id specified</div>;
  }
  return (
    <div className="max-w-6xl h-[95vh] m-auto flex items-center justify-center">
      <GalleryInfo galleryId={params.galleryId} />
      <ReviewPreview listOfReview={listOfReview} />
    </div>
  );
};

export default Home;
function showError(error: unknown) {
  throw new Error("Function not implemented.");
}

