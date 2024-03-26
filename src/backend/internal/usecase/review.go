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

func populateCustomersAndBookings(ctx context.Context, reviews []*model.Review, userUsecase UserUseCase, bookingUsecase BookingUseCase, galleryUsecase GalleryUseCase) error {
	for _, review := range reviews {
		customer, err := userUsecase.UserRepo.FindOneById(ctx, review.CustomerId)
		if err != nil {
			return err
		}
		review.Customer = *customer

		booking, err := bookingUsecase.BookingRepo.FindOneById(ctx, review.BookingId)
		if err != nil {
			return err
		}
		review.Booking = *booking

		gallery, err := galleryUsecase.GalleryRepo.FindOneById(ctx, booking.GalleryId)
		if err != nil {
			return err
		}
		review.Booking.Gallery = *gallery
	}

	return nil
}

func (p *ReviewUseCase) FindByUserId(ctx context.Context, userId uuid.UUID, userUsecase UserUseCase, bookingUsecase BookingUseCase, galleryUsecase GalleryUseCase) ([]*model.Review, error) {
	reviews, err := p.ReviewRepo.FindByUserId(ctx, userId)
	if err != nil {
		return nil, err
	}

	if err := populateCustomersAndBookings(ctx, reviews, userUsecase, bookingUsecase, galleryUsecase); err != nil {
		return nil, err
	}

	return reviews, nil
}

func (p *ReviewUseCase) FindByGalleryId(ctx context.Context, galleryId uuid.UUID, userUsecase UserUseCase, bookingUsecase BookingUseCase, galleryUsecase GalleryUseCase) ([]*model.Review, error) {
	reviews, err := p.ReviewRepo.FindByGalleryId(ctx, galleryId)
	if err != nil {
		return nil, err
	}

	if err := populateCustomersAndBookings(ctx, reviews, userUsecase, bookingUsecase, galleryUsecase); err != nil {
		return nil, err
	}

	return reviews, nil
}

func (p *ReviewUseCase) FindByPhotographerId(ctx context.Context, photographerId uuid.UUID, userUsecase UserUseCase, bookingUsecase BookingUseCase, galleryUsecase GalleryUseCase) ([]*model.Review, error) {
	reviews, err := p.ReviewRepo.FindByPhotographerId(ctx, photographerId)
	if err != nil {
		return nil, err
	}

	if err := populateCustomersAndBookings(ctx, reviews, userUsecase, bookingUsecase, galleryUsecase); err != nil {
		return nil, err
	}

	return reviews, nil
}
