"use client";

import { useRef, useState } from "react";
import React from "react";
import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward, IoIosAdd } from "react-icons/io";
import { HiOutlinePlusSm } from "react-icons/hi";
import { GrLocation } from "react-icons/gr";

// Define Status enum inside the component if it's not imported
enum Status {
  Unverified = "UNVERIFIED",
  Pending = "PENDING",
  Verified = "VERIFIED",
  Failed = "FAILED",
}

// Accept setStatus as a prop
const PhotographerVerification = ({
  setStatus,
}: {
  setStatus: (status: Status) => void;
}) => {
  const [idNumber, setIdNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [submitError, setSubmitError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      // Validate file size (20MB = 20 * 1024 * 1024 bytes)
      if (file.size > 20 * 1024 * 1024) {
        alert("File size must not exceed 20MB.");
        setSubmitError(true);
        return;
      }

      // Validate file type
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        alert("Only PNG and JPG files are allowed.");
        setSubmitError(true);
        return;
      }

      // If validations pass, update the state
      setFile(file);
      setFileName(file.name);
      setSubmitError(false);
    } else {
      // If no file is selected, reset the state
      setFile(null);
      setFileName("");
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click(); // Programmatically click the hidden file input
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // If a file is selected, check for size and type
    if (
      file &&
      (file.size > 20 * 1024 * 1024 ||
        (file.type !== "image/png" && file.type !== "image/jpeg"))
    ) {
      setSubmitError(true);
      return;
    }

    if (!idNumber || !file) {
      setSubmitError(true);
      return;
    }

    // Handle ID card verification submission logic here if idNumber and file are present
    setSubmitError(false);

    // Set the submission to true to display the message
    setIsSubmitted(true);

    // Submit the form data
    // Simulate successful form submission
    // Update the parent component's status to show the PendingVerification component
    setStatus(Status.Pending);
  };
  return (
    <form className="h-full w-full m-auto" onSubmit={onSubmit}>
      <div className="space-y-4">
        <div className="border-b border-gray-900/10 pb-4">
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            <div className="sm:col-span-2">
              <h2 className="text-title">My Galleries</h2>
              <p className="text-standard font-semibold text-red-500">
                Photographer status: Unverified
              </p>
              <p className="text-standard text-gray-700">
                This section is only accessible for verified photographer.
              </p>
              <p className="text-standard text-gray-700">
                Please submit verification request below.
              </p>
            </div>
            <div className="sm:col-span-2">
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
              {submitError && !idNumber && (
                <div className="text-sm text-red-500">
                  Please enter the ID number.
                </div>
              )}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="idCard" className="label-normal">
                Upload ID Card
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-yellow-400 border-dashed rounded-md">
                <div className="space-y-1 text-center flex flex-col justify-center">
                  <div className="flex justify-center items-center">
                    <Image
                      src={"/images/UploadToCloud.png"}
                      alt="Upload icon"
                      width={100}
                      height={100}
                    />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    id="fileInput"
                    className="hidden"
                    onChange={onFileChange}
                  />
                  <button
                    type="button" // This should be a button, not a submit button
                    className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    onClick={handleBrowseClick} // Trigger the file input click
                  >
                    Browse
                  </button>
                  {fileName && (
                    <div className="text-sm text-gray-900">{fileName}</div>
                  )}
                  {submitError && !file && (
                    <div className="text-sm text-red-500">
                      Please upload a file.
                    </div>
                  )}
                  <div className="mt-4">
                    <span className="text-gray-500">Max file size : 20 MB</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-gray-500">
                      Supported file types : JPG, PNG
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
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
