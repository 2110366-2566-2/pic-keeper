export interface NewUser {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
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
  Failed = "failed",
  Success = "success",
}

export interface Photographer {
  id: string;
  user_id: string;
  is_verified: boolean;
}

export interface Administrator {
  id: string;
  email: string;
  password: string;
  logged_out: boolean;
}

export interface BaseResponse {
  status: Status;
}

export interface ErrorResponse extends BaseResponse {
  error?: string;
  errors?: string[];
  message?: string;
}

export interface RegisterCustomerResponse extends BaseResponse {
  data: User;
}

export interface RegisterPhotoGrapherResponse extends BaseResponse {
  data: Photographer;
}

export interface LoginResponse extends BaseResponse {
  data: User;
  profile_picture_url: string;
  session_token: string;
}

export interface RefreshTokenResponse extends BaseResponse {
  refreshed_session_token: string;
}

export interface GoogleLoginResponse extends BaseResponse {
  url: string;
}

export interface LogoutResponse extends BaseResponse {
  message: string;
}

export interface UploadProfilePictureResponse extends BaseResponse {
  profile_picture_url: string;
}

export interface GetUserInfoResponse extends BaseResponse {
  data: User;
  profile_picture_url: string;
}

export interface ListUnverifiedPhotographerResponse extends BaseResponse {
  data: Photographer[];
}

export interface VerifyResponse extends BaseResponse {
  data: Photographer;
}

export interface RoomMembers {
  members_ids: string[];
}
