import IssueReport from "@/components/Admin/IssuesReported";

const IssuesReported = () => {
  return (
    <div className="space-y-4">
      <div className="text-2xl font-bold text-gray-800">Issues Reported</div>
      <IssueReport />
    </div>
  );
};

export default IssuesReported;
