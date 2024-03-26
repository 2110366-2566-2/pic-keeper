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

func populateRoomsInBookings(ctx context.Context, roomUsecase RoomUseCase, galleryUsecase GalleryUseCase, bookings ...*model.Booking) error {
	roomIds := []uuid.UUID{}

	for _, booking := range bookings {
		roomIds = append(roomIds, booking.RoomId)
	}

	rooms, err := roomUsecase.RoomRepo.FindByIds(ctx, roomIds...)
	if err != nil {
		return err
	}

	roomIdMapping := make(map[uuid.UUID]*model.Room)
	for _, room := range rooms {
		roomIdMapping[room.Id] = room
	}

	if err := populateGalleryInRooms(ctx, galleryUsecase, rooms...); err != nil {
		return err
	}

	for _, booking := range bookings {
		booking.Room = *roomIdMapping[booking.RoomId]
	}

	return nil
}

func (b *BookingUseCase) FindByUserIdWithStatus(ctx context.Context, userId uuid.UUID, galleryUsecase GalleryUseCase, roomUsecase RoomUseCase, bkStatus ...string) ([]*model.Booking, error) {
	bookings, err := b.BookingRepo.FindByUserIdWithStatus(ctx, userId, bkStatus...)
	if err != nil {
		return nil, err
	}

	if err := populateRoomsInBookings(ctx, roomUsecase, galleryUsecase, bookings...); err != nil {
		return nil, err
	}

	return bookings, nil
}

func (b *BookingUseCase) FindByPhotographerIdWithStatus(ctx context.Context, phtgId uuid.UUID, galleryUsecase GalleryUseCase, roomUsecase RoomUseCase, status ...string) ([]*model.Booking, error) {
	bookings, err := b.BookingRepo.FindByPhotographerIdWithStatus(ctx, phtgId, status...)
	if err != nil {
		return nil, err
	}

	if err := populateRoomsInBookings(ctx, roomUsecase, galleryUsecase, bookings...); err != nil {
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

	if err := populateRoomsInBookings(ctx, roomUsecase, galleryUsecase, bookings...); err != nil {
		return nil, err
	}

	return bookings, nil
}
