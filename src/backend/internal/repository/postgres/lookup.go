package postgres

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type LookupDB struct {
	*BaseDB[model.UserRoomLookup]
}

func NewLookupDB(db *bun.DB) *LookupDB {
	type T = model.UserRoomLookup

	return &LookupDB{
		BaseDB: NewBaseDB[T](db),
	}
}

func (l *LookupDB) FindByUserId(ctx context.Context, userId uuid.UUID) ([]*model.UserRoomLookup, error) {
	var subscriptions []*model.UserRoomLookup
	if err := l.db.NewSelect().Model(&subscriptions).Where("user_id = ?", userId).Scan(ctx, &subscriptions); err != nil {
		return nil, err
	}

	return subscriptions, nil
}

func (l *LookupDB) FindByRoomId(ctx context.Context, roomId uuid.UUID) ([]*model.UserRoomLookup, error) {
	var subscriptions []*model.UserRoomLookup
	if err := l.db.NewSelect().Model(&subscriptions).Where("room_id = ?", roomId).Scan(ctx, &subscriptions); err != nil {
		return nil, err
	}

	return subscriptions, nil
}

func (l *LookupDB) CheckRoomMembership(ctx context.Context, userId, roomId uuid.UUID) (bool, error) {
	var lookup model.UserRoomLookup
	exist, err := l.db.NewSelect().Model(&lookup).Where("user_id = ? AND room_id = ?", userId, roomId).Exists(ctx)
	if err != nil {
		return false, err
	}

	return exist, nil
}
