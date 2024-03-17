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

export interface Message {
  data: string;
  id: string;
  room: string;
  sender: string;
  ts: string;
  type: string;
}

export interface SendMessage {
  data: string;
  type: string;
  room: string;
  sender: string;
}
