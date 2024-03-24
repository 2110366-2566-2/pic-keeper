import { Booking } from "./booking";
import { Gallery, Photo } from "./gallery";
import { Conversation, Room, UserRoomLookup } from "./room";
import { PhotographerStatus, User } from "./user";

export interface SuccessResponse<T> {
  status: Status.Success;
  data: T | null;
}

export interface BasicSuccessResponse {
  status: Status.Success;
}

// Error response type for when an error occurs
export interface ErrorResponse {
  status: Status.Failed;
  error: string;
  message?: string;
}

export enum Status {
  Failed = "failed",
  Success = "success",
}

// Utilize generic type for responses that contain data.
export type UserResponse = SuccessResponse<User>;
export type UserListResponse = SuccessResponse<User[]>;

export type GalleryResponse = SuccessResponse<Gallery>;
export type GalleryListResponse = SuccessResponse<Gallery[]>;

export type SelfStatusResponse = SuccessResponse<PhotographerStatus>;

export type BookingListResponse = SuccessResponse<Booking[]>;
export type BookingResponse = SuccessResponse<Booking>;

export type PhotoResponse = SuccessResponse<Photo>;

export type UserRoomLookUpListResponse = SuccessResponse<UserRoomLookup[]>;

export type ConversationListResponse = SuccessResponse<Conversation[]>;

export type RoomResponse = SuccessResponse<Room>;
export type RoomListResponse = SuccessResponse<Room[]>;

export interface LoginResponse extends SuccessResponse<User> {
  session_token: string;
  profile_picture_url: string;
}
export interface RefreshTokenResponse extends BasicSuccessResponse {
  refreshed_session_token: string;
}

export interface GoogleLoginResponse extends BasicSuccessResponse {
  url: string;
}

export interface LogoutResponse extends BasicSuccessResponse {
  message: string;
}

export interface UploadProfilePictureResponse extends BasicSuccessResponse {
  profile_picture_url: string;
}

export interface GetUserInfoResponse extends SuccessResponse<User> {
  profile_picture_url?: string;
}

export interface DeleteResponse extends SuccessResponse<string> {}

export type UrlsListResponse = SuccessResponse<string[]>;

export type StringResponse = SuccessResponse<string>;

export interface GetRoomOfUserByGalleryIdResponse
  extends SuccessResponse<Room> {
  exist: boolean;
}
