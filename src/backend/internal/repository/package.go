package repository

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
)

type Package interface {
	BaseRepo[model.Package]
	FindByPhotographerId(ctx context.Context, photographerId uuid.UUID) ([]*model.Package, error)
	SearchWithFilter(ctx context.Context, filter *model.SearchFilter) ([]*model.Package, error)
}
