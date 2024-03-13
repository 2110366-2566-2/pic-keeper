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

func (p *GalleryUseCase) FindByPhotographerId(ctx context.Context, photographerId uuid.UUID) ([]*model.Gallery, error) {
	return p.GalleryRepo.FindByPhotographerId(ctx, photographerId)
}

func (p *GalleryUseCase) SearchWithFilter(ctx context.Context, filter *model.SearchFilter) ([]*model.Gallery, error) {
	return p.GalleryRepo.SearchWithFilter(ctx, filter)
}
