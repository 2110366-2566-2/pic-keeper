"use client";
import { useState } from "react";
import { format } from "date-fns";
import { useEffect } from "react";
import { adminService } from "@/services";
import { useModal } from "@/context/ModalContext";
import { IssueFilter } from "@/types/issue";
import { Issue } from "@/types/issue";
import { useErrorModal } from "@/hooks/useErrorModal";

const IssueReported = () => {
  const [reportList, setReportList] = useState<Issue[]>();
  const { openModal, closeModal } = useModal();
  const [filter, setFilter] = useState<IssueFilter>({});
  const showError = useErrorModal();

  const fetchData = async () => {
    try {
      const data = await adminService.GetIssuesWithOption(filter);
      if (data.data) {
        setReportList(data.data);
      }
    } catch (error) {
      showError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleActionClick = (issue : Issue) => {
    openModal(
      <div className="flex flex-col">
        <p className="text-standard text-gray-500">
          This will delete your gallery from PicKeeper.
        </p>
        <div className="self-end flex gap-4">
          <button onClick={closeModal} className="btn mt-4 px-4">
            Cancel
          </button>
          <button className="btn-danger mt-4 px-4 ">Delete</button>
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
              <th className="px-6 py-3 font-normal text-left text-gray-500">
                ID
              </th>
              <th className="px-6 py-3 font-normal text-left text-gray-500">
                Requested by
              </th>
              <th className="px-6 py-3 font-normal text-left text-gray-500">
                Subject
              </th>
              <th className="px-6 py-3 font-normal text-left text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 font-normal text-left text-gray-500">
                Created date
              </th>
              <th className="px-6 py-3 font-normal text-left text-gray-500">
                Due date
              </th>
              <th className="px-6 py-3 font-normal text-left text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* DATA */}
            {reportList?.map((issue) => (
              <tr key={issue.id}>
                <td className="px-6 py-4 text-gray-900 underline underline-offset-1">
                  #{issue.id.slice(0, 5)}
                </td>
                <td className="px-6 py-4 text-gray-900">
                  {issue.reporter.email || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-900">{issue.subject}</td>
                <td className="px-6 py-4 text-green-500">{issue.status}</td>
                <td className="px-6 py-4 text-gray-900">{format(issue.created_at, "MMMM do, yyyy H:mma") || "N/A"}</td>
                <td className="px-6 py-4 text-gray-900">{format(issue.due_date, "MMMM do, yyyy H:mma") || "N/A"}</td>
                <td className="px-6 py-4 text-gray-900">
                  <button onClick={() => handleActionClick(issue)}>...</button>
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
