package usecase

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type PhotoUseCase struct {
	PhotoRepo repository.Photo
}

func NewPhotoUseCase(db *bun.DB) *PhotoUseCase {
	return &PhotoUseCase{
		PhotoRepo: postgres.NewPhotoDB(db),
	}
}

func (p *PhotoUseCase) FindUrlsByGalleryId(ctx context.Context, galleryId uuid.UUID) ([]string, error) {
	photos, err := p.PhotoRepo.FindByGalleryId(ctx, galleryId)
	if err != nil {
		return nil, err
	}

	var urls []string
	for _, photo := range photos {
		urls = append(urls, util.GetGalleryPictureUrl(&photo.PhotoKey))
	}

	return urls, nil
}
