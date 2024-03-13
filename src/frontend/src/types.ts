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

export interface Gallery {
  id: string;
  photographer_id: string;
  location: string;
  name: string;
  price: number;
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

export interface RequestPhotographerRoleResponse extends BaseResponse {
  data: Photographer;
}

export interface GalleryListResponse extends BaseResponse {
  data: Gallery[];
}

export interface GalleryResponse extends BaseResponse {
  data: Gallery;
}

export interface NewGallery {
  name?: string;
  location?: string;
  price?: number;
}

export interface DeleteResponse extends BaseResponse {
  data: string;
}

export enum BookingStatus {
  BookingPaidStatus = "USER_PAID",
  BookingCancelledStatus = "CANCELLED",
  BookingCustomerReqCancelStatus = "C_REQ_CANCEL",
  BookingPhotographerReqCancelStatus = "P_REQ_CANCEL",
  BookingCompletedStatus = "COMPLETED",
  BookingPaidOutStatus = "PAID_OUT",
}

export interface BookingProposal {
  package_id: string;
  start_time: string;
  end_time: string;
}

export interface Booking {
  id: string;
  customer_id: string;
  package_id: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

export interface SearchFilter {
  photographer_id?: string;
  location?: string;
  min_price?: number;
  max_price?: number;
}

export interface Room {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface UserRoomLookup {
  id: string;
  user_id: string;
  room_id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Conversation {
  id: string;
  text: string;
  user_id: string;
  room_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null; // Use Date or null for optional properties
}

export interface RoomMemberInput {
  member_ids: string[];
}

export interface BookingListResponse {
  data: Booking[];
}

export interface BookingResponse {
  data: Booking;
}

export interface Photo {
  id: string;
  gallery_id: string;
  photo_key: string;
}

export interface PhotoResponse {
  data: Photo;
}

export interface UrlsListResponse {
  data: string[];
}
