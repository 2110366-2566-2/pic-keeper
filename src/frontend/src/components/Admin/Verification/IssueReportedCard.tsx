import { useModal } from "@/context/ModalContext";
import { useErrorModal } from "@/hooks/useErrorModal";
import { Issue } from "@/types/issue";
import { capitalizeFirstLetter } from "@/utils/string";
import { format } from "date-fns";
import BookingCard from "@/components/Booking/BookingCard";

interface Props {
  issue: Issue;
  handleRefundAction: Function;
  handleRejectAction: Function;
}

const IssueReportedCard = (data: Props) => {
  const { openModal } = useModal();

  const handleActionClick = ({ issue, handleRefundAction, handleRejectAction }: Props) => {
    openModal(
      <div className="flex flex-row">
        <div className="flex flex-col space-y-3">
          <div className="flex flex-row space-x-3">
            <h2 className="text-stone-400">#{issue.id.slice(0, 5)}</h2>
            <div className="text-green-500">OPEN</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="">Reporter</div>
            <div className="">
              <div className="">{issue.reporter.email}</div>
              {issue.reporter.name ? (
                <div className="text-gray-400">{issue.reporter.name}</div>
              ) : (
                ""
              )}
            </div>
            <div className="">Created date</div>
            <div className="">
              {format(issue.created_at, "MMMM do, yyyy H:mma") || "N/A"}
            </div>
            <div className="">Due date</div>
            <div className="">
              {format(issue.due_date, "MMMM do, yyyy H:mma") || "N/A"}
            </div>
          </div>
          <div className="">Details</div>
          <div className="rounded-md ring ring-slate-600 h-full">
            <article className="m-4">{issue.description}</article>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                data.handleRefundAction(data.issue.id);
              }}
              className="bg-amber-500 text-white rounded-md p-2"
            >
              Refund
            </button>
            <button
              onClick={() => {
                data.handleRejectAction(data.issue.id);
              }}
              className="bg-red-600 text-white rounded-md p-2"
            >
              Reject
            </button>
          </div>
        </div>
        {/* <BookingCard props={issue.}/> */}
      </div>,
      `${capitalizeFirstLetter(issue.subject)} request`
    );
  };

  return (
    <div className="">
      <button onClick={() => handleActionClick(data.issue)}>...</button>
    </div>
  );
};

export default IssueReportedCard;
