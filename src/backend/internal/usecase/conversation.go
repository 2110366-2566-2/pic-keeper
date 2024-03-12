package usecase

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type ConversationUseCase struct {
	ConversationRepo repository.Conversation
}

func NewConversationUseCase(db *bun.DB) *ConversationUseCase {
	return &ConversationUseCase{
		ConversationRepo: postgres.NewConversationDB(db),
	}
}

func (c *ConversationUseCase) ListByRoomId(ctx context.Context, roomId uuid.UUID) ([]*model.Conversation, error) {
	return c.ConversationRepo.ListByRoomId(ctx, roomId)
}
