"use client";
import { useEffect } from "react";
import adminService from "../../services/admin";
import { User } from "@/types/user";
import { useState } from "react";
import { useModal } from "@/context/ModalContext";
import PhotographerVerificationModal from "./Verification/PhotographerVerificationModal";
import { VerificationTicket } from "@/types/verification";

function Verification() {
  const [pendingList, setPendingList] = useState<VerificationTicket[]>([]);
  const { openModal, closeModal } = useModal();

  const fetchData = async () => {
    try {
      const data = await adminService.listPendingPhotographer();
      console.log(data);
      if (data) {
        setPendingList(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleActionClick = (ticket : VerificationTicket) => {
    openModal(
      <PhotographerVerificationModal
        photographer={{
          // Assuming User and VerificationTicket have similar fields
          username: ticket.user.username,
          name: ticket.user.firstname || "N/A", // Adjust based on actual field
          createdDate: ticket.createdAt || "N/A", // Adjust based on actual field
          idNumber: ticket.user.id || "N/A",
          additionalInfo: ticket.additionalDescription || "N/A",
          idCardImage: ticket.idCardPictureURL || "DefaultImagePath", // Adjust based on actual field
        }}
        isOpen={true}
        closeModal={closeModal}
      />,
      "Photographer Verification"
    );
  };

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
                  <a href={`/view-profile/${ticket.userId}`}>
                    #{ticket.id.slice(0, 5)}
                  </a>
                </td>
                <td className="px-6 py-4 text-gray-900">{ticket.user.username}</td>
                <td className="px-6 py-4 text-gray-900">{ticket.additionalDescription}</td>
                <td className="px-6 py-4 text-green-500">
                  {ticket.user.verification_status}
                </td>
                <td className="px-6 py-4 text-gray-900">{ticket.createdAt}</td>
                <td className="px-6 py-4 text-gray-900">{ticket.dueDate}</td>
                <td className="px-6 py-4 text-gray-900">
                  <button onClick={() => handleActionClick(ticket)}>...</button>
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
