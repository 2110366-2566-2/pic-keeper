import { Review } from "@/types/review";
import ReviewCard from "@/components/Booking/Review";

const ReviewPreview = ({ listOfReview }: { listOfReview: Review[] }) => {
    return (
      <>
        {listOfReview && listOfReview.length > 0 && (
          <div className="w-full shadow-md rounded-md">
            <div className="text-amber-500 font-semibold text-xl p-4">Reviews</div>
            <div className="grid grid-cols-auto-fill-400  gap-4 p-4">
              {listOfReview &&
                listOfReview.map((review) => (
                  <ReviewCard info={review} />
                ))}
            </div>
          </div>
        )}
      </>
    );
};

export default ReviewPreview;
