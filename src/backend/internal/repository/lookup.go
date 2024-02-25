package repository

import (
	"github.com/Roongkun/software-eng-ii/internal/model"
)

type Lookup interface {
	BaseRepo[model.UserRoomLookup]
	// FindByUserId(ctx context.Context, userId uuid.UUID) ([]*uuid.UUID, error)
}
