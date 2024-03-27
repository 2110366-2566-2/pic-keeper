"use client";
import { useEffect } from "react";
import adminService from "../../services/admin";
import { User } from "@/types/user";
import { useState } from "react";
import { useModal } from "@/context/ModalContext";

function Verification() {
  const [pendingList, setPendingList] = useState<User[]>([]);
  const { openModal, closeModal } = useModal();

  const fetchData = async () => {
    try {
      const data = await adminService.listPendingPhotographer();
      console.log(data)
      if (data.data) {
        setPendingList(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleActionClick = async () => {
    openModal(
      <div className="flex flex-col">
        <p className="text-standard text-gray-500">
          This will delete your gallery from PicKeeper.
        </p>
        <div className="self-end flex gap-4">
          <button onClick={closeModal} className="btn mt-4 px-4">
            Cancel
          </button>
          <button className="btn-danger mt-4 px-4 ">
            Delete
          </button>
        </div>
      </div>,
      "Are you sure?"
    );
  };

  return (
    <div className="flex flex-col">
      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 font-normal text-left text-gray-500">ID</th>
              <th className="px-6 py-3 font-normal text-left text-gray-500">Requested by</th>
              <th className="px-6 py-3 font-normal text-left text-gray-500">Additional info</th>
              <th className="px-6 py-3 font-normal text-left text-gray-500">Status</th>
              <th className="px-6 py-3 font-normal text-left text-gray-500">Created date</th>
              <th className="px-6 py-3 font-normal text-left text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* DATA */}
            {pendingList.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 text-gray-900 underline underline-offset-1">
                  <a href={`/view-profile/${user.id}`}>#{user.id.slice(0, 5)}</a>
                </td>
                <td className="px-6 py-4 text-gray-900">{user.username}</td>
                <td className="px-6 py-4 text-gray-900">{user.about}</td>
                <td className="px-6 py-4 text-green-500">
                  {user.verification_status}
                </td>
                <td className="px-6 py-4 text-gray-900">17/2/24</td>
                <td className="px-6 py-4 text-gray-900">17/3/24</td>
                <td className="px-6 py-4 text-gray-900">
                  <button onClick={handleActionClick}>...</button>
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
