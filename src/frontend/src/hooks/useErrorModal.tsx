"use client";

import { useModal } from "@/context/ModalContext";
import { AxiosError } from "axios";
import { useState } from "react";

export function useErrorModal() {
  const { openModal, closeModal } = useModal();
  const showError = (error: unknown, title: string = "An error occurred") => {
    const errorMessage =
      error instanceof AxiosError
        ? error.response?.data.error.error
        : "An unexpected error occurred";
    const content = (
      <div className="flex flex-col">
        <p className="text-standard text-gray-500">{errorMessage}</p>
        <button onClick={closeModal} className="btn-danger mt-4 px-4 self-end">
          Close
        </button>
      </div>
    );

    openModal(content, title);
  };

  return showError;
}
