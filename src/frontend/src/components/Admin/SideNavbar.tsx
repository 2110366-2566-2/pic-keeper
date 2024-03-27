import { IoTimerOutline } from "react-icons/io5";
import { BsTicket } from "react-icons/bs";
import { RiAdminFill } from "react-icons/ri";
import { useState } from "react";

const SideNavbar = () => {
  return (
    <aside className="h-screen bg-gray-100 text-gray-800">
      <div className="flex flex-col h-full">
        <div className="mt-10">
          {/* LOGO */}
          <article className="hidden px-6 text-4xl font-bold truncate sm:flex">Admin<RiAdminFill /></article>
          <article className="hidden px-6 text-4xl font-bold truncate sm:flex">Dashboard</article>

          {/* NAVIGATION */}
          {/* VERIFICATION TICKETS */}
          <nav className="mt-10">
            <a
              href="/admin/dashboard/verification-tickets"
              className={`flex items-center py-3 px-10 hover:bg-gray-200`}
            >
              <BsTicket size={25}/>
              <span className="text-nowrap hidden ml-3 sm:flex">Verification tickets</span>
            </a>
            {/* ISSUE REPORTED */}
            <a
              href="/admin/dashboard/issues-reported"
              className={`flex items-center py-3 px-10 hover:bg-gray-200`}
            >
              <IoTimerOutline size={25} />
              <span className="hidden ml-3 sm:flex">Issues reported</span>
            </a>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default SideNavbar;
