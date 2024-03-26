import apiClientWithAuth from "@/libs/apiClientWithAuth";
import {
  UserRoomLookUpListResponse,
  ConversationListResponse,
  RoomResponse,
  RoomListResponse,
  GetRoomOfUserByGalleryIdResponse,
  BookingResponse,
} from "@/types/response";
import { RoomMemberInput } from "@/types/room";

const roomBaseUrl = "/rooms/v1";

const createRoom = async (roomMembers: RoomMemberInput) => {
  try {
    const { data } = await apiClientWithAuth.post<RoomResponse>(
      roomBaseUrl,
      roomMembers
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const getAllRooms = async () => {
  try {
    const { data } = await apiClientWithAuth.get<RoomListResponse>(roomBaseUrl);
    return data;
  } catch (error) {
    throw error;
  }
};

const getRoomInfo = async (id: string) => {
  try {
    const { data } = await apiClientWithAuth.get<RoomResponse>(
      `${roomBaseUrl}/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const getAllConversations = async (id: string) => {
  try {
    const { data } = await apiClientWithAuth.get<ConversationListResponse>(
      `${roomBaseUrl}/conversation/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const GetBookingFromRoom = async (roomId: string) => {
  try {
    const { data } = await apiClientWithAuth.get<BookingResponse>(
      `${roomBaseUrl}/booking/${roomId}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const getRoomOfUserByGalleryId = async (galleryId: string) => {
  try {
    const { data } =
      await apiClientWithAuth.get<GetRoomOfUserByGalleryIdResponse>(
        `${roomBaseUrl}/gallery/${galleryId}`
      );
    return data;
  } catch (error) {
    throw error;
  }
};

const roomService = {
  createRoom,
  getAllRooms,
  getRoomInfo,
  getAllConversations,
  GetBookingFromRoom,
  getRoomOfUserByGalleryId,
};

export default roomService;
