package repository

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
)

type Review interface {
	BaseRepo[model.Review]
	FindByUserId(ctx context.Context, userId uuid.UUID) ([]*model.Review, error)
	FindByGalleryId(ctx context.Context, galleryId uuid.UUID) ([]*model.Review, error)
	FindByPhotographerId(ctx context.Context, photographerId uuid.UUID) ([]*model.Review, error)
	CheckExistenceByGalleryId(ctx context.Context, galleryId uuid.UUID) (bool, error)
	SumAndCountRatingByGalleryId(ctx context.Context, galleryId uuid.UUID) (int, int, error)
}
