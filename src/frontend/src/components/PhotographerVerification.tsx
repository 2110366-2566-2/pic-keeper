"use client";

import { useState } from "react";

const PhotographerVerification = () => {
  const [idNumber, setIdNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState("");

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setFile(file);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle ID card verification submission logic here
  };

  return (
    <form className="h-full w-full m-auto" onSubmit={onSubmit}>
      <div className="space-y-4">
        <div className="border-b border-gray-900/10 pb-4">
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-6 gap-x-6 gap-y-3">
            <div className="sm:col-span-4">
              <h2 className="text-title">My Galleries</h2>
              <p className="text-standard font-semiboldtext-gray-700">
                This section is only accessible for verified photographer.
                Please submit verification request below.
              </p>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="idNumber" className="label-normal">
                ID number
              </label>
              <input
                type="text"
                id="idNumber"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="form-input mt-2"
                required
              />
            </div>
            <div>
              <label
                htmlFor="idCard"
                className="block text-sm font-medium text-gray-700"
              >
                Upload ID card
              </label>
              <input
                type="file"
                id="idCard"
                onChange={onFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:rounded-md file:border-0 file:bg-gray-50 file:py-2 file:px-4 file:text-gray-700 hover:file:bg-gray-100"
                required
              />
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="additionalInfo" className="label-normal">
                Additional Information
              </label>
              <textarea
                id="additionalInfo"
                rows={4}
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="form-input mt-2"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default PhotographerVerification;
