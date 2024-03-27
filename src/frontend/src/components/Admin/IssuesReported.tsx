'use client'
import { useState } from "react";
import { Booking } from "@/types/booking";
import { useEffect } from "react";
import { adminService } from "@/services";

const IssueReported = () => {
  const [reportList, setReportList] = useState<Booking[]>([]);
  const fetchData = async () => {
    try {
      const data = await adminService.listPendingRefundBookings();
      if (data.data) {
        setReportList(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
            {reportList.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 text-gray-900 underline underline-offset-1">
                  <a href={`/view-profile/${user.id}`}>
                    #{user.id.slice(0, 5)}
                  </a>
                </td>
                <td className="px-6 py-4 text-gray-900">{user.username}</td>
                <td className="px-6 py-4 text-gray-900">{user.about}</td>
                <td className="px-6 py-4 text-green-500">
                  {user.verification_status}
                </td>
                <td className="px-6 py-4 text-gray-900">17/2/24</td>
                <td className="px-6 py-4 text-gray-900">17/3/24</td>
                <td className="px-6 py-4 text-gray-900">
                  <button>...</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssueReported;
