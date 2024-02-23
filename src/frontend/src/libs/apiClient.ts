import { ErrorResponse, Status } from "@/types";
import axios from "axios";
import ApiError from "./ApiError";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response, // Just return the response for successful requests
  (error) => {
    // Handle errors
    if (error.response) {
      const serverResponse: ErrorResponse = error.response.data || {
        status: Status.Failed,
        error: error.message || "An unexpected error occurred",
      };
      throw new ApiError(serverResponse);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
);

export default apiClient;
