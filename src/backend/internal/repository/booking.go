package repository

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
)

type Booking interface {
	BaseRepo[model.Booking]
	FindByUserId(ctx context.Context, userId uuid.UUID) ([]*model.Booking, error)
	FindByUserIdWithStatus(ctx context.Context, userId uuid.UUID, status string) ([]*model.Booking, error)
}
