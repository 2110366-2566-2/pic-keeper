import apiClientWithAuth from "@/libs/apiClientWithAuth";
import {
  UserRoomLookUpListResponse,
  ConversationListResponse,
  RoomResponse,
} from "@/types/response";
import { RoomMemberInput } from "@/types/room";

const roomBaseUrl = "/rooms/v1";

const createRoom = async (roomMembers: RoomMemberInput) => {
  try {
    const { data } = await apiClientWithAuth.post<UserRoomLookUpListResponse>(
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
    const { data } = await apiClientWithAuth.get<UserRoomLookUpListResponse>(
      roomBaseUrl
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const getRoomInfo = async (id: string) => {
  try {
    const { data } = await apiClientWithAuth.get<RoomResponse>(
      `roomBaseUrl/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const getAllConversations = async (id: string) => {
  try {
    const { data } = await apiClientWithAuth.get<ConversationListResponse>(
      `${roomBaseUrl}/${id}`
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
};

export default roomService;
