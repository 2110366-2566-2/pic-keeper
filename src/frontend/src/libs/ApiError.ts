import { ErrorResponse } from "@/types";

class ApiError extends Error {
  public response: ErrorResponse;

  constructor(response: ErrorResponse) {
    super(response.error);
    this.name = this.constructor.name; // Set the error's name to its class name
    this.response = response;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export default ApiError;
