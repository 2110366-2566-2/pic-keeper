import { Review } from "@/types/review";
import StarBox from "../Miscellaneouos/StarBox";

const ReviewCard = ({ info }: { info: Review }) => {
  return (
    <div className="w-full h-full rounded-md shadow-md p-4 text-gray-600 ">
      <div className="space-y-2">
        <div className="flex flex-row space-x-4">
          <div className="text-xl font-bold place-self-center">{info.customer.email}</div>
          <StarBox rating={info.rating}/>
        </div>
        <article className="text-wrap">{info.review_text}</article>
      </div>
    </div>
  );
};

export default ReviewCard;
