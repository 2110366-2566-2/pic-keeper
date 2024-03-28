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
  const [
    isPhotographerVerificationModalOpen,
    setIsPhotographerVerificationModalOpen,
  ] = useState(false);

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
                  <a href={`/view-profile/${ticket.userId}`}>
                    #{ticket.id.slice(0, 5)}
                  </a>
                </td>
                <td className="px-6 py-4 text-gray-900">{user.userId}</td>
                <td className="px-6 py-4 text-gray-900">
                  {user.additionalDescription}
                </td>
                <td className="px-6 py-4 text-green-500">open</td>
                <td className="px-6 py-4 text-gray-900">{user.createdAt}</td>
                <td className="px-6 py-4 text-gray-900">{user.dueDate}</td>
                <td className="px-6 py-4 text-gray-900">
                  <button onClick={openPhotographerVerificationModal}>
                    ...
                  </button>
                  <PhotographerVerificationModal
                    isOpen={isPhotographerVerificationModalOpen}
                    closeModal={closePhotographerVerificationModal}
                    // You would pass the actual photographer data here
                    photographer={{
                      name: user.user.firstname,
                      username: user.userId,
                      createdDate: user.createdAt,
                      idNumber: user.idCardNumber,
                      additionalInfo: user.additionalDescription,
                      idCardImage: user.idCardPictureURL,
                    }}
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
