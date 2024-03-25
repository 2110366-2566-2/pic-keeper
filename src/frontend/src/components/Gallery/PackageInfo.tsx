import { Gallery } from "@/types/gallery";
import { IoIosCamera, IoIosTime } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";

interface Props {
  gallery: Gallery;
}

const PackageInfo = ({ gallery }: Props) => {
  return (
    <div className="space-y-4 rounded-xl ring-1 p-4 ring-gray-300 max-h-64 overflow-y-scroll">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Package</h2>
        <p className="text-lg font-bold text-amber-600">{gallery.price} THB</p>
      </div>
      <ul className="space-y-2 text-gray-700">
        <li className="flex gap-2 items-center">
          <IoIosCamera className="w-6 h-6" />
          <span>{gallery.hours} hours photography event</span>
        </li>
        <li className="flex gap-2 items-center">
          <IoLocationSharp className="w-6 h-6" />
          <span>{gallery.location}</span>
        </li>
        <li className="flex gap-2 items-center">
          <IoIosTime className="w-6 h-6" />
          <span>{gallery.delivery_time} days delivery</span>
        </li>
        {gallery.included.map((include, index) => (
          <li key={index} className="list-disc list-inside text-gray-400">
            <span className="text-gray-600">{include}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PackageInfo;
