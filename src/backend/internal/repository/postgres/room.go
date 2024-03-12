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

func (r *RoomDB) FindByUserId(ctx context.Context, userId uuid.UUID) ([]*model.Room, error) {
	var rooms []*model.Room
	if err := r.db.NewSelect().Model(&rooms).Where("user_id = ?", userId).Scan(ctx, &rooms); err != nil {
		return nil, err
	}

	return rooms, nil
}
