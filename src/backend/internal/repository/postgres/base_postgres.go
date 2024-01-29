package postgres

import (
	"context"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type BaseDB[T any] struct {
	*bun.DB
}

func NewBaseDB[T any](db *bun.DB) *BaseDB[T] {
	return &BaseDB[T]{db}
}

func (b *BaseDB[T]) AddOne(ctx context.Context, model *T) error {
	// TODO: implement
	return nil
}

func (b *BaseDB[T]) AddBatch(ctx context.Context, model []*T) error {
	// TODO: implement
	return nil
}

func (b *BaseDB[T]) UpdateOne(ctx context.Context, model *T) error {
	// TODO: implement
	return nil
}

func (b *BaseDB[T]) DeleteOneById(ctx context.Context, id uuid.UUID) (uuid.UUID, error) {
	// TODO: implement
	return uuid.Nil, nil
}

func (b *BaseDB[T]) DeleteByIds(ctx context.Context, id ...uuid.UUID) ([]uuid.UUID, error) {
	// TODO: implement
	return nil, nil
}

func (b *BaseDB[T]) FindOneById(ctx context.Context, id uuid.UUID) (*T, error) {
	// TODO: implement
	return nil, nil
}

func (b *BaseDB[T]) FindByIds(ctx context.Context, ids ...uuid.UUID) ([]*T, error) {
	// TODO: implement
	return nil, nil
}
