package repository

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
)

type Lookup interface {
	BaseRepo[model.UserRoomLookup]
	FindByUserId(ctx context.Context, userId uuid.UUID) ([]*model.UserRoomLookup, error)
	FindByRoomId(ctx context.Context, roomId uuid.UUID) ([]*model.UserRoomLookup, error)
	CheckRoomMembership(ctx context.Context, userId, roomId uuid.UUID) (bool, error)
}
