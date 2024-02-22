package chat

import "github.com/google/uuid"

type event interface {
	isEvent()
}

type Event struct{}

type Connected struct {
	userId    uuid.UUID
	sessionId uuid.UUID
}

func (Connected) isEvent() {}

type Disconnected struct {
	userId    uuid.UUID
	sessionId uuid.UUID
}

func (Disconnected) isEvent() {}
