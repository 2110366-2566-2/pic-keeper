package repository

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
)

type Photo interface {
	BaseRepo[model.Photo]
	FindByGalleryId(ctx context.Context, galleryId uuid.UUID) ([]*model.Photo, error)
}
