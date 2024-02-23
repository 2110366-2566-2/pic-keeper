package chat

import "github.com/google/uuid"

type Message struct {
	From uuid.UUID `json:"from"`
	To   uuid.UUID `json:"to"`
	Text string    `json:"text,omitempty"`
}
