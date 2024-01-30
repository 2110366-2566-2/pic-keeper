package postgres

import (
	"context"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type BaseDB[T any] struct {
	db *bun.DB
}

func NewBaseDB[T any](db *bun.DB) *BaseDB[T] {
	return &BaseDB[T]{db}
}

func (b *BaseDB[T]) AddOne(ctx context.Context, model *T) error {
	_, err := b.db.NewInsert().Model(model).Exec(ctx)
	return err
}

func (b *BaseDB[T]) AddBatch(ctx context.Context, models []*T) error {
	_, err := b.db.NewInsert().Model(&models).Exec(ctx)
	return err
}

func (b *BaseDB[T]) UpdateOne(ctx context.Context, model *T) error {
	_, err := b.db.NewUpdate().Model(model).WherePK().Exec(ctx)
	return err
}

func (b *BaseDB[T]) DeleteOneById(ctx context.Context, id uuid.UUID) (uuid.UUID, error) {
	var models []*T
	var deletedId uuid.UUID

	if err := b.db.NewDelete().Model(&models).Where("id = ?", id).Returning("id").Scan(ctx, &deletedId); err != nil {
		return uuid.Nil, err
	}
	return deletedId, nil
}

func (b *BaseDB[T]) DeleteByIds(ctx context.Context, ids ...uuid.UUID) ([]uuid.UUID, error) {
	var models []*T
	var deletedIds []uuid.UUID

	if err := b.db.NewDelete().Model(&models).Where("id IN (?)", bun.In(ids)).Returning("id").Scan(ctx, &deletedIds); err != nil {
		return nil, err
	}
	return deletedIds, nil
}

func (b *BaseDB[T]) FindOneById(ctx context.Context, id uuid.UUID) (*T, error) {
	var model T
	if err := b.db.NewSelect().Model(&model).Where("id = ?", id).Scan(ctx, &model); err != nil {
		return nil, err
	}
	return &model, nil
}

func (b *BaseDB[T]) FindByIds(ctx context.Context, ids ...uuid.UUID) ([]*T, error) {
	var models []*T
	if err := b.db.NewSelect().Model(&models).Where("id IN (?)", bun.In(ids)).Scan(ctx, &models); err != nil {
		return nil, err
	}
	return models, nil
}
