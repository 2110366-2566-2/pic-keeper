import { Review } from "@/types/review";
import StarBox from "../Miscellaneouos/StarBox";

const ReviewCard = ({ info }: { info: Review }) => {
  return (
    <div className="w-full h-full rounded-md shadow-md p-4">
      <div className="space-y-2">
        <div className="flex flex-row space-x-4 text-xl font-bold">
          <div className="">{info.customer.email}</div>
          <StarBox rating={info.rating}/>
        </div>
        <article className="text-wrap">{info.review_text}</article>
      </div>
    </div>
  );
};

export default ReviewCard;
