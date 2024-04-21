"use client";
import { useEffect } from "react";
import adminService from "../../services/admin";
import { useState } from "react";
import PhotographerVerificationModal from "./Verification/PhotographerVerificationModal";
import { VerificationTicket } from "@/types/verification";
import { useErrorModal } from "@/hooks/useErrorModal";
import { format } from "date-fns";

function Verification() {
  const [pendingList, setPendingList] = useState<VerificationTicket[]>([]);
  const showError = useErrorModal();
  const [
    isPhotographerVerificationModalOpen,
    setIsPhotographerVerificationModalOpen,
  ] = useState(false);

  const fetchData = async () => {
    try {
      const data = await adminService.listPendingPhotographer();
      console.log(data.data);
      if (data.data) {
        setPendingList(data.data);
      }
    } catch (error) {
      showError(error);
    }
  };

  // Function to open the PhotographerVerificationModal
  const openPhotographerVerificationModal = () =>
    setIsPhotographerVerificationModalOpen(true);
    
  // Function to close the PhotographerVerificationModal
  const closePhotographerVerificationModal = () =>
    setIsPhotographerVerificationModalOpen(false);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 font-normal text-left text-gray-500">
                ID
              </th>
              <th className="px-6 py-3 font-normal text-left text-gray-500">
                Requested by
              </th>
              <th className="px-6 py-3 font-normal text-left text-gray-500">
                Additional info
              </th>
              <th className="px-6 py-3 font-normal text-left text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 font-normal text-left text-gray-500">
                Created date
              </th>
              <th className="px-6 py-3 font-normal text-left text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* DATA */}
            {pendingList.map((ticket) => (
              <tr key={ticket.id}>
                <td className="px-6 py-4 text-gray-900 underline underline-offset-1">
                  <a href={`/view-profile/${ticket.user.email}`}>
                    #{ticket.id.slice(0, 5)}
                  </a>
                </td>
                <td className="px-6 py-4 text-gray-900">{ticket.user.email}</td>
                <td className="px-6 py-4 text-gray-900">
                  {format(ticket.created_at, "MMMM do, yyyy H:mma") || "N/A"}
                </td>
                <td className={`px-6 py-4 ${ticket.user.verification_status === 'VERIFIED' ? 'text-green-500' : ticket.user.verification_status === 'PENDING' ? 'text-yellow-500' : 'text-red-500'}`}>{ticket.user.verification_status}</td>
                <td className="px-6 py-4 text-gray-900">{format(ticket.due_date, "MMMM do, yyyy H:mma") || "N/A"}</td>
                <td className="px-6 py-4 text-gray-900">
                  <button onClick={openPhotographerVerificationModal}>
                    ...
                  </button>
                  <PhotographerVerificationModal
                    isOpen={isPhotographerVerificationModalOpen}
                    closeModal={closePhotographerVerificationModal}
                    photographer={ticket}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Verification;
