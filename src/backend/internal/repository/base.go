package repository

import (
	"context"

	"github.com/google/uuid"
)

type BaseRepo[T any] interface {
	AddOne(ctx context.Context, model *T) error
	AddBatch(ctx context.Context, models []*T) error
	UpdateOne(ctx context.Context, model *T) error
	DeleteOneById(ctx context.Context, id uuid.UUID) (uuid.UUID, error)
	DeleteByIds(ctx context.Context, ids ...uuid.UUID) ([]uuid.UUID, error)
	FindOneById(ctx context.Context, id uuid.UUID) (*T, error)
	FindByIds(ctx context.Context, ids ...uuid.UUID) ([]*T, error)
}
