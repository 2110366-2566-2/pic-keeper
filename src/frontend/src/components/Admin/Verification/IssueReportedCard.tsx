import { useModal } from "@/context/ModalContext";
import { useErrorModal } from "@/hooks/useErrorModal";
import { Issue } from "@/types/issue";

const IssueReported = () => {
  const { openModal, closeModal } = useModal();
  const showError = useErrorModal();

  const handleActionClick = (issue: Issue) => {
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
  return <div className=""></div>;
};

export default IssueReported;
