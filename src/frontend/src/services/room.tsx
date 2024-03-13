import apiClientWithAuth from "@/libs/apiClientWithAuth";
import { RoomMemberInput } from "@/types";

const roomBaseUrl = "/room/v1";

const createRoom = async (roomMembers: RoomMemberInput) => {
  try {
    const response = await apiClientWithAuth.post(roomBaseUrl, roomMembers);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllRooms = async () => {
  try {
    const response = await apiClientWithAuth.get(roomBaseUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllConversations = async (id: string) => {
  try {
    const response = await apiClientWithAuth.get(`${roomBaseUrl}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const roomService = {
  createRoom,
  getAllRooms,
  getAllConversations,
};

export default roomService;
