package repository

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
)

type Gallery interface {
	BaseRepo[model.Gallery]
	FindByPhotographerId(ctx context.Context, photographerId uuid.UUID) ([]*model.Gallery, error)
	SearchWithFilter(ctx context.Context, filter *model.SearchFilter) ([]*model.Gallery, error)
}
