import { useModal } from "@/context/ModalContext";
import { useErrorModal } from "@/hooks/useErrorModal";
import { Issue } from "@/types/issue";

const IssueReportedCard = () => {
  const { openModal, closeModal } = useModal();
  const showError = useErrorModal();

  const handleActionClick = () => {
    openModal(
      <div className="flex flex-row">
        <div className="">
            Hello this is testing button
        </div>
      </div>,
      "Test Modal"
    );
  };

return (
    <button onClick={() => handleActionClick()}>
            ...
    </button>
);
};

export default IssueReportedCard;
