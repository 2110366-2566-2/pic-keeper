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

func (b *BookingUseCase) FindByUserIdWithStatus(ctx context.Context, userId uuid.UUID, galleryUsecase GalleryUseCase, roomUsecase RoomUseCase, bkStatus ...string) ([]*model.Booking, error) {
	bookings, err := b.BookingRepo.FindByUserIdWithStatus(ctx, userId, bkStatus...)
	if err != nil {
		return nil, err
	}

	if err := roomUsecase.PopulateRoomsInBookings(ctx, galleryUsecase, bookings...); err != nil {
		return nil, err
	}

	return bookings, nil
}

func (b *BookingUseCase) FindByPhotographerIdWithStatus(ctx context.Context, phtgId uuid.UUID, galleryUsecase GalleryUseCase, roomUsecase RoomUseCase, status ...string) ([]*model.Booking, error) {
	bookings, err := b.BookingRepo.FindByPhotographerIdWithStatus(ctx, phtgId, status...)
	if err != nil {
		return nil, err
	}

	if err := roomUsecase.PopulateRoomsInBookings(ctx, galleryUsecase, bookings...); err != nil {
		return nil, err
	}

	return bookings, nil
}

func (b *BookingUseCase) UpdateStatusRoutine() error {
	currentTime := time.Now()
	return b.BookingRepo.UpdateStatusRoutine(context.Background(), currentTime)
}

func (b *BookingUseCase) ListPendingRefundBookings(ctx context.Context, galleryUsecase GalleryUseCase, roomUsecase RoomUseCase) ([]*model.Booking, error) {
	bookings, err := b.BookingRepo.ListPendingRefundBookings(ctx)
	if err != nil {
		return nil, err
	}

	if err := roomUsecase.PopulateRoomsInBookings(ctx, galleryUsecase, bookings...); err != nil {
		return nil, err
	}

	return bookings, nil
}

func (b *BookingUseCase) FindByRoomId(ctx context.Context, roomUsecase RoomUseCase, galleryUsecase GalleryUseCase, roomId uuid.UUID) (*model.Booking, error) {
	booking, err := b.BookingRepo.FindByRoomId(ctx, roomId)
	if err != nil {
		return nil, err
	}

	if err := roomUsecase.PopulateRoomsInBookings(ctx, galleryUsecase, booking); err != nil {
		return nil, err
	}

	return booking, nil
}
