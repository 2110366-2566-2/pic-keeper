package repository

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
)

type Room interface {
	BaseRepo[model.Room]
	CheckRoomExistenceOfUserByGalleryId(ctx context.Context, availableRoom []uuid.UUID, galleryId uuid.UUID) (bool, error)
	FindRoomOfUserByGalleryId(ctx context.Context, availableRoom []uuid.UUID, galleryId uuid.UUID) (*model.Room, error)
}
