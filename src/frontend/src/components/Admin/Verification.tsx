"use client";

import React, { useState, useEffect } from "react";
import adminService from "@/services/admin";
import PhotographerVerificationModal from "./Verification/PhotographerVerificationModal";
import { VerificationTicket } from "@/types/verification";
import { useErrorModal } from "@/hooks/useErrorModal";
import { format } from "date-fns";

function Verification() {
  const [pendingList, setPendingList] = useState<VerificationTicket[]>([]);
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const showError = useErrorModal();

  const fetchData = async () => {
    try {
      const data = await adminService.listPendingPhotographer();
      if (data.data) {
        setPendingList(data.data);
      }
    } catch (error) {
      showError(error);
    }
  };

  const openPhotographerVerificationModal = (id: string) => {
    setActiveModalId(id);
  };

  const closePhotographerVerificationModal = () => {
    setActiveModalId(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
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
                <td
                  className={`px-6 py-4 ${
                    ticket.user.verification_status === "VERIFIED"
                      ? "text-green-500"
                      : ticket.user.verification_status === "PENDING"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {ticket.user.verification_status}
                </td>
                <td className="px-6 py-4 text-gray-900">
                  {format(ticket.due_date, "MMMM do, yyyy H:mma") || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-900">
                  <button
                    onClick={() => openPhotographerVerificationModal(ticket.id)}
                  >
                    ...
                  </button>
                </td>
                {activeModalId === ticket.id && (
                  <PhotographerVerificationModal
                    isOpen={activeModalId === ticket.id}
                    closeModal={closePhotographerVerificationModal}
                    photographer={ticket}
                  />
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Verification;
