import { FaStar } from "react-icons/fa6";

const StarBox = ({ rating }: { rating: number }) => {
  return (
    <div className="rounded-md shadow-md px-1 bg-white">
      <div className="space-x-1 flex flex-row">
        <div className="font-semibold">{rating}</div>
        <FaStar className="text-yellow-400 place-self-center mb-1" />
      </div>
    </div>
  );
};

export default StarBox;
