import React, { useState } from 'react';
import { useModal } from "@/context/ModalContext";

interface ReportIssueProps {
    onCancel?: () => void;
}

const ReportIssue: React.FC<ReportIssueProps> = ({ onCancel }) => {
    const [issue, setIssue] = useState<string>('');
    const { openModal } = useModal();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        alert(`Issue reported: ${issue}`);
        setIssue('');

        openModal(
            <div className="p-4 max-w-md mx-auto bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">Issue Reported Successfully</h5>
                <p className="text-base text-gray-500 dark:text-gray-400">Thank you for reporting the issue. We will look into it as soon as possible.</p>
                <div className="flex justify-end mt-4">
                    <button className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500" onClick={() => {/* Implement closing logic if necessary */ }}>Close</button>
                </div>
            </div>,
            "Your report is submitted"
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40">
            <div className="bg-white p-5 rounded-lg w-1/2 max-w-md shadow-md">
                <h2 className="text-left text-2xl mb-5">Report technical issue</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="issueInput" className="block mb-2">
                        Please specify
                    </label>
                    <textarea
                        id="issueInput"
                        value={issue}
                        onChange={e => setIssue(e.target.value)}
                        className="w-full h-36 mb-2 p-2 text-base rounded-md border border-gray-300"
                        placeholder="Describe your issue here"
                    />
                    <div className="flex justify-center mt-5">
                        <button type="button" onClick={onCancel} className="bg-white text-gray-600 py-2 px-5 border-none rounded-md cursor-pointer text-lg mr-15">
                            Cancel
                        </button>
                        <button type="submit" className="bg-yellow-500 text-white py-2 px-5 border-none rounded-md cursor-pointer text-lg">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportIssue;