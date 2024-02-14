package repository

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
)

type Admin interface {
	BaseRepo[model.Administrator]
	FindOneByEmail(ctx context.Context, email string) (*model.Administrator, error)
	CheckExistenceByEmail(ctx context.Context, email string) (bool, error)
}
