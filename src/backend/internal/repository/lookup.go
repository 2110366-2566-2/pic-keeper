package repository

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
)

type Lookup interface {
	BaseRepo[model.UserRoomLookup]
	FindByUserId(ctx context.Context, userId uuid.UUID) ([]*uuid.UUID, error)
}
