package postgres

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type RoomDB struct {
	*BaseDB[model.Room]
}

func NewRoomDB(db *bun.DB) *RoomDB {
	type T = model.Room

	return &RoomDB{
		BaseDB: NewBaseDB[T](db),
	}
}

func (r *RoomDB) CheckRoomExistenceOfUserByGalleryId(ctx context.Context, availableRoomIds []uuid.UUID, galleryId uuid.UUID) (bool, error) {
	var room model.Room
	return r.db.NewSelect().Model(&room).Where("id IN (?) AND gallery_id = ?", bun.In(availableRoomIds), galleryId).Exists(ctx)
}

func (r *RoomDB) FindRoomOfUserByGalleryId(ctx context.Context, availableRoomIds []uuid.UUID, galleryId uuid.UUID) (*model.Room, error) {
	var room model.Room
	if err := r.db.NewSelect().Model(&room).Where("id IN (?) AND gallery_id = ?", bun.In(availableRoomIds), galleryId).Scan(ctx, &room); err != nil {
		return nil, err
	}

	return &room, nil
}

func (r *RoomDB) FindOtherUsersInRoom(ctx context.Context, selfUserId, roomId uuid.UUID) ([]*model.User, error) {
	var lookup model.UserRoomLookup
	var otherUsers []*model.User

	subq := r.db.NewSelect().Model(&lookup).Where("user_id != ? AND room_id = ?", selfUserId, roomId).Column("user_id")

	if err := r.db.NewSelect().Model(&otherUsers).Where("id IN (?)", subq).Scan(ctx, &otherUsers); err != nil {
		return nil, err
	}

	return otherUsers, nil
}
