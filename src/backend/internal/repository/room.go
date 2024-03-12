package repository

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
)

type Room interface {
	BaseRepo[model.Room]
	FindByUserId(ctx context.Context, userId uuid.UUID) ([]*model.Room, error)
}
