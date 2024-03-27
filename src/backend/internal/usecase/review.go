package usecase

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type ReviewUseCase struct {
	ReviewRepo repository.Review
}

func NewReviewUseCase(db *bun.DB) *ReviewUseCase {
	return &ReviewUseCase{
		ReviewRepo: postgres.NewReviewDB(db),
	}
}

func (r *ReviewUseCase) FindByUserId(ctx context.Context, userId uuid.UUID) ([]*model.Review, error) {
	return r.ReviewRepo.FindByUserId(ctx, userId)
}

func (r *ReviewUseCase) FindByGalleryId(ctx context.Context, galleryId uuid.UUID) ([]*model.Review, error) {
	return r.ReviewRepo.FindByGalleryId(ctx, galleryId)
}

func (r *ReviewUseCase) FindByPhotographerId(ctx context.Context, photographerId uuid.UUID) ([]*model.Review, error) {
	return r.ReviewRepo.FindByPhotographerId(ctx, photographerId)
}

func (r *ReviewUseCase) SumAndCountRatingByGalleryId(ctx context.Context, galleryId uuid.UUID) (int, int, error) {
	exist, err := r.ReviewRepo.CheckExistenceByGalleryId(ctx, galleryId)
	if err != nil {
		return 0, 0, err
	}

	if !exist {
		return 0, 0, nil
	}

	return r.ReviewRepo.SumAndCountRatingByGalleryId(ctx, galleryId)
}
