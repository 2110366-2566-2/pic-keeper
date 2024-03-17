/**
 * Represents basic information for a new user.
 */
export interface NewUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

/**
 * Detailed user information, including login and profile details.
 */
export interface User {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  provider: string | null;
  logged_out: string;
  profile_picture_key: string;
  verification_status: PhotographerStatus;
}

export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export enum PhotographerStatus {
  NotVerified = "NOT_VERIFIED",
  Pending = "PENDING",
  Verified = "VERIFIED",
  Rejected = "REJECTED",
}
