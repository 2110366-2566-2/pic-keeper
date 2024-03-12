package repository

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
)

type Conversation interface {
	BaseRepo[model.Conversation]
	ListByRoomId(ctx context.Context, roomId uuid.UUID) ([]*model.Conversation, error)
}
