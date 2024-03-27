import React, { useState } from "react";
import { useModal } from "@/context/ModalContext";
import userService from "@/services/user";
import { useErrorModal } from "@/hooks/useErrorModal";
import { Dialog } from "@headlessui/react";

interface ReportIssueProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportIssue = ({ isOpen, onClose }: ReportIssueProps) => {
  const [issue, setIssue] = useState<string>("");
  const { openModal, closeModal } = useModal();
  const showError = useErrorModal();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await userService.reportIssue({ description: issue });
      setIssue("");
      onClose();

      openModal(
        <div className="modal-content">
          <p className="text-base text-gray-500 dark:text-gray-400">
            Thank you for reporting the issue. We will look into it as soon as
            possible.
          </p>
          <div className="flex justify-end mt-4">
            <button
              className="btn-cancel px-5"
              onClick={() => {
                closeModal();
              }}
            >
              Close
            </button>
          </div>
        </div>,
        "Your report is submitted"
      );
    } catch (error) {
      showError(error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
          <Dialog.Title>Report technical issue</Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <label htmlFor="issueInput" className="text-standard">
              Please specify
            </label>
            <textarea
              id="issueInput"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="form-input w-72"
              rows={5}
              placeholder="Describe your issue here"
            />
            <div className="flex justify-center mt-5 gap-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-cancel py-2 px-5"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary py-2 px-5">
                Submit
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ReportIssue;
