package usecase

import (
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
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
