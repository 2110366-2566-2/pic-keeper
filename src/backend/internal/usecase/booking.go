package usecase

import (
	"context"
	"time"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type BookingUseCase struct {
	BookingRepo repository.Booking
}

func NewBookingUseCase(db *bun.DB) *BookingUseCase {
	return &BookingUseCase{
		BookingRepo: postgres.NewBookingDB(db),
	}
}

func populateGalleries(ctx context.Context, bookings []*model.Booking, galleryUsecase GalleryUseCase) error {
	galleryIds := []uuid.UUID{}

	for _, booking := range bookings {
		galleryIds = append(galleryIds, booking.GalleryId)
	}

	galleries, err := galleryUsecase.GalleryRepo.FindByIds(ctx, galleryIds...)
	if err != nil {
		return err
	}

	galleryIdMapping := make(map[uuid.UUID]*model.Gallery)
	for _, gallery := range galleries {
		galleryIdMapping[gallery.Id] = gallery
	}

	for _, booking := range bookings {
		booking.Gallery = *galleryIdMapping[booking.GalleryId]
	}

	return nil
}

func (b *BookingUseCase) FindByUserIdWithStatus(ctx context.Context, userId uuid.UUID, galleryUsecase GalleryUseCase, bkStatus ...string) ([]*model.Booking, error) {
	bookings, err := b.BookingRepo.FindByUserIdWithStatus(ctx, userId, bkStatus...)
	if err != nil {
		return nil, err
	}

	if err := populateGalleries(ctx, bookings, galleryUsecase); err != nil {
		return nil, err
	}

	return bookings, nil
}

func (b *BookingUseCase) FindByPhotographerIdWithStatus(ctx context.Context, phtgId uuid.UUID, galleryUsecase GalleryUseCase, status ...string) ([]*model.Booking, error) {
	bookings, err := b.BookingRepo.FindByPhotographerIdWithStatus(ctx, phtgId, status...)
	if err != nil {
		return nil, err
	}

	if err := populateGalleries(ctx, bookings, galleryUsecase); err != nil {
		return nil, err
	}

	return bookings, nil
}

func (b *BookingUseCase) UpdateStatusRoutine() error {
	currentTime := time.Now()
	return b.BookingRepo.UpdateStatusRoutine(context.Background(), currentTime)
}

func (b *BookingUseCase) ListPendingRefundBookings(ctx context.Context) ([]*model.Booking, error) {
	return b.BookingRepo.ListPendingRefundBookings(ctx)
}
