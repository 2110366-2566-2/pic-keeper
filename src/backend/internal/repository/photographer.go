package repository

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
)

type Photographer interface {
	BaseRepo[model.Photographer]
	ListUnverifiedPhotographers(ctx context.Context) ([]*model.Photographer, error)
}
