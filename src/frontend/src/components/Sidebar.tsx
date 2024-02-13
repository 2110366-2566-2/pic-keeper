import { IoTimerOutline } from "react-icons/io5";
import { BsTicket } from "react-icons/bs";
import { IoMailOpenOutline } from "react-icons/io5";
import { LuUser2 } from "react-icons/lu";

const Sidebar = () => {
    return (
      <aside className="w-80 h-screen bg-gray-900 text-white">
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className=" font-semibold text-2xl p-6 text-yellow-500 bg-gray-900">PicKeeper</div>
            <div className="px-6 text-4xl font-bold">Admin</div>
            <nav className="mt-10">
              <a href="#" className="flex items-center py-2 px-8 hover:bg-gray-700">
                <IoTimerOutline />
                <span className="ml-3">Issues reported</span>
              </a>
              <a href="#" className="flex items-center py-2 px-8 hover:bg-gray-700">
                {/* ... SVG for Verification tickets */}
                <BsTicket/>
                <span className="ml-3">Verification tickets</span>
              </a>
              <a href="#" className="flex items-center py-2 px-8 hover:bg-gray-700">
                <IoMailOpenOutline />
                <span className="ml-3">Messages</span>
              </a>
              <a href="#" className="flex items-center py-2 px-8 hover:bg-gray-700">
                <LuUser2/>
                <span className="ml-3">Profile</span>
              </a>
            </nav>
          </div>
          <div className="px-6 py-4">
            <div className="flex justify-between">
              
            </div>
          </div>
        </div>
      </aside>
    );
  };
  
  export default Sidebar;
  