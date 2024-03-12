"use client";

import { useState } from "react";
import Image from "next/image";
import Modal from "@/components/Modal";
import userService from "@/services/user";
import authService from "@/services/auth";

interface PhotographerVerificationProps {
  // Add any props needed for the component
}

const PhotographerVerification: React.FC<
  PhotographerVerificationProps
> = () => {
  const [idNumber, setIdNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const closeModal = () => setIsModalOpen(false);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setFile(file);
  };

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    // Handle ID card verification submission logic here
  };

  return (
    <>
      <div className="w-screen h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            My galleries
          </h2>
          <p className="text-gray-600 mb-4">
            Photographer status:{" "}
            <span className="text-red-500">Unverified</span>
          </p>
          <p className="text-sm text-gray-600 mb-4">
            This section is only accessible for verified photographer.
            <br />
            Please submit verification request below.
          </p>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="idNumber"
                className="block text-sm font-medium text-gray-700"
              >
                ID number
              </label>
              <input
                type="text"
                id="idNumber"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload ID card
              </label>
              <div className="flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v24a4 4 0 004 4h16m8-12h-8m0 0l4 4m-4-4l4-4M20 32l4-4-4-4"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="additionalInfo"
                className="block text-sm font-medium text-gray-700"
              >
                Additional information
              </label>
              <textarea
                id="additionalInfo"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                style={{ minHeight: "80px" }}
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PhotographerVerification;
