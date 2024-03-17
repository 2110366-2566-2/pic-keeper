import Image from "next/image";
import { FaBell } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";

const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="flex justify-between items-center px-4 py-2">
        {/* Left side - Title */}
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Verification Tickets
          </h1>
        </div>

        {/* Right side - User Info and Notifications */}
        <div className="flex items-center">
          {/* Notification Icon */}
          <div className="items-center px-3">
            <button className="text-xl text-gray-500 focus:outline-none mr-4">
              <FaBell />
            </button>

            <button className="text-2xl text-gray-500 focus:outline-none mr-4">
              <IoIosMail />
            </button>
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <button className="flex items-center focus:outline-none">
              <div className="mr-2 text-gray-800">
                <span className="font-semibold">Napat Niti</span>
                <span className="text-sm text-gray-500 block">#admin1234</span>
              </div>
              <div className="relative bg-gray-300 rounded-full w-8 h-8">
                <Image
                  src={""}
                  alt="Profile Preview"
                  fill={true}
                  className="rounded-full object-cover" // Make the image circular
                />
              </div>
            </button>
            {/* Dropdown menu, show/hide based on dropdown state */}
            {/* Dropdown goes here */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
