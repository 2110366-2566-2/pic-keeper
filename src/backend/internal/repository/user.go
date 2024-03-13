package repository

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
)

type User interface {
	BaseRepo[model.User]
	FindOneByEmail(ctx context.Context, email string) (*model.User, error)
	CheckExistenceByEmail(ctx context.Context, email string) (bool, error)
	ListPendingPhotographers(ctx context.Context) ([]*model.User, error)
}
