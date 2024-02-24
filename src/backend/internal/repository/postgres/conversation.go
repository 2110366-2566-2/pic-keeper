package postgres

import (
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/uptrace/bun"
)

type ConversationDB struct {
	*BaseDB[model.Conversation]
}

func NewConversationDB(db *bun.DB) *ConversationDB {
	type T = model.Conversation

	return &ConversationDB{
		BaseDB: NewBaseDB[T](db),
	}
}
