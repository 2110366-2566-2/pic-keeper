package chat

import "github.com/google/uuid"

type UserId uuid.UUID

type RoomId uuid.UUID

type SessionId uuid.UUID

func (u *UserId) String() string {
	return uuid.UUID(*u).String()
}

func (r *RoomId) String() string {
	return uuid.UUID(*r).String()
}

func (s *SessionId) String() string {
	return uuid.UUID(*s).String()
}
