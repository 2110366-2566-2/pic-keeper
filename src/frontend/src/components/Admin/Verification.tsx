"use client";
import { useEffect } from "react";
import adminService from "../../services/admin";
import { User } from "@/types/user";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { start } from "repl";

function Verification() {
  const [pendingList, setPendingList] = useState<User[]>([]);
  const { data: session, status } = useSession();
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
    console.log(session?.user.data?.email , "is admin = " , session?.user.data?.is_admin)
    console.log("but" , session?.user.data?.verification_status)
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50 flex">
            <tr>
              <th className="px-6 py-3 font-normal text-left text-gray-500">ID</th>
              <th className="px-6 py-3 font-normal text-left text-gray-500">Requested by</th>
              <th className="px-6 py-3 font-normal text-left text-gray-500">Additional info</th>
              <th className="px-6 py-3 font-normal text-left text-gray-500">Status</th>
              <th className="px-6 py-3 font-normal text-left text-gray-500">Created date</th>
              <th className="px-6 py-3 font-normal text-left text-gray-500">Due date</th>
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
                  <button>...</button>
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
