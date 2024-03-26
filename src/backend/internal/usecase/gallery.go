package usecase

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type GalleryUseCase struct {
	GalleryRepo repository.Gallery
}

func NewGalleryUseCase(db *bun.DB) *GalleryUseCase {
	return &GalleryUseCase{
		GalleryRepo: postgres.NewGalleryDB(db),
	}
}

func (g *GalleryUseCase) FindByPhotographerId(ctx context.Context, photographerId uuid.UUID) ([]*model.Gallery, error) {
	return g.GalleryRepo.FindByPhotographerId(ctx, photographerId)
}

func (g *GalleryUseCase) SearchWithFilter(ctx context.Context, filter *model.SearchFilter) ([]*model.Gallery, error) {
	return g.GalleryRepo.SearchWithFilter(ctx, filter)
}

func (g *GalleryUseCase) PopulateGalleryInRooms(ctx context.Context, rooms ...*model.Room) error {
	galleryIds := []uuid.UUID{}
	for _, room := range rooms {
		galleryIds = append(galleryIds, room.GalleryId)
	}

	galleries, err := g.GalleryRepo.FindByIds(ctx, galleryIds...)
	if err != nil {
		return err
	}

	galleryIdMapping := make(map[uuid.UUID]*model.Gallery)
	for _, gallery := range galleries {
		galleryIdMapping[gallery.Id] = gallery
	}

	for _, room := range rooms {
		room.Gallery = *galleryIdMapping[room.GalleryId]
	}

	return nil
}
