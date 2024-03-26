import { IoTimerOutline } from "react-icons/io5";
import { BsTicket } from "react-icons/bs";


const SideNavbar = () => {


  return (
    <aside className="h-screen bg-gray-900 text-white">
      <div className="flex flex-col justify-between h-full">
        <div>
          {/* LOGO */}
          <div className=" font-semibold text-2xl p-6 text-amber-500 bg-gray-900">
            PicKeeper
          </div>
          <div className="px-6 text-4xl font-bold">Admin</div>

          {/* NAVIGATION */}
          {/* VERIFICATION TICKETS */}
          <nav className="mt-10">
            <a
              href="/admin/dashboard/verification-tickets"
              className="flex items-center py-2 px-8 hover:bg-gray-700"
            >
              <BsTicket />
              <span className="ml-3">Verification tickets</span>
            </a>
            {/* ISSUE REPORTED */}
            <a
              href="/admin/dashboard/issues-reported"
              className="flex items-center py-2 px-8 hover:bg-gray-700"
            >
              <IoTimerOutline />
              <span className="ml-3">Issues reported</span>
            </a>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default SideNavbar;
