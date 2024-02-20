import { UUID } from "crypto";

export interface NewUser {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: UUID;
  name: string;
  email: string;
  provider: string | null;
  logged_out: string;
  profile_picture_key: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export enum Status {
  Failed = "Failed",
  Success = "Success",
}

export interface BaseResponse {
  status: Status;
  error?: string;
  message?: string;
}

export interface RegisterCustomerResponse extends BaseResponse {
  data?: User;
}

export interface LoginResponse extends BaseResponse {
  data?: User;
  profile_picture_url?: string;
}
