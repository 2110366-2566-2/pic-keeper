package usecase

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type RoomUseCase struct {
	RoomRepo repository.Room
}

func NewRoomUseCase(db *bun.DB) *RoomUseCase {
	return &RoomUseCase{
		RoomRepo: postgres.NewRoomDB(db),
	}
}

func (r *RoomUseCase) PopulateRoomsInBookings(ctx context.Context, galleryUsecase GalleryUseCase, bookings ...*model.Booking) error {
	roomIds := []uuid.UUID{}

	for _, booking := range bookings {
		roomIds = append(roomIds, booking.RoomId)
	}

	rooms, err := r.RoomRepo.FindByIds(ctx, roomIds...)
	if err != nil {
		return err
	}

	roomIdMapping := make(map[uuid.UUID]*model.Room)
	for _, room := range rooms {
		roomIdMapping[room.Id] = room
	}

	if err := galleryUsecase.PopulateGalleryInRooms(ctx, rooms...); err != nil {
		return err
	}

	for _, booking := range bookings {
		booking.Room = *roomIdMapping[booking.RoomId]
	}

	return nil
}

func (r *RoomUseCase) FindRoomOfUserByGalleryId(ctx context.Context, availableRoomIds []uuid.UUID, galleryId uuid.UUID) (bool, *model.Room, error) {
	exist, err := r.RoomRepo.CheckRoomExistenceOfUserByGalleryId(ctx, availableRoomIds, galleryId)
	if err != nil {
		return false, nil, err
	}

	if !exist {
		return false, nil, nil
	}

	room, err := r.RoomRepo.FindRoomOfUserByGalleryId(ctx, availableRoomIds, galleryId)
	if err != nil {
		return false, nil, err
	}

	return true, room, nil
}

func (r *RoomUseCase) FindOtherUsersInRoom(ctx context.Context, selfUserId, roomId uuid.UUID) ([]*model.User, error) {
	return r.RoomRepo.FindOtherUsersInRoom(ctx, selfUserId, roomId)
}
