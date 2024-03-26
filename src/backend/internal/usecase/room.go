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
