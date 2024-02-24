package repository

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
)

type Photographer interface {
	BaseRepo[model.Photographer]
	ListUnverifiedPhotographers(ctx context.Context) ([]*model.Photographer, error)
	CheckExistenceByUserId(ctx context.Context, userId uuid.UUID) (bool, error)
}
