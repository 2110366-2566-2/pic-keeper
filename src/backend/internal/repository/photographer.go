package repository

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
)

type Photographer interface {
	BaseRepo[model.Photographer]
	FindOneByEmail(ctx context.Context, email string) (*model.Photographer, error)
	CheckExistenceByEmail(ctx context.Context, email string) (bool, error)
	ListUnverifiedPhotographers(ctx context.Context) ([]*model.Photographer, error)
}
