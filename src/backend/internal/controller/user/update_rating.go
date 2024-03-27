package user

import (
	"context"
	"log"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/usecase"
)

func UpdateGalleryRating(ctx context.Context, galleryUsecase usecase.GalleryUseCase, reviewUsecase usecase.ReviewUseCase, gallery *model.Gallery) error {
	ratingSum, ratingCount, err := reviewUsecase.SumAndCountRatingByGalleryId(ctx, gallery.Id)
	if err != nil {
		return err
	}

	if ratingCount == 0 {
		gallery.AvgRating = nil
	} else {
		averageRating := float32(ratingSum) / float32(ratingCount)
		log.Println(averageRating)
		log.Println(ratingCount)
		log.Println(ratingSum)
		gallery.AvgRating = &averageRating
	}

	if err := galleryUsecase.GalleryRepo.UpdateOne(ctx, gallery); err != nil {
		return err
	}

	return nil
}
