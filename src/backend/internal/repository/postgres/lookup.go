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

// return list of rooms

// and return of user in the room except self

func (l *LookupDB) FindByUserId(ctx context.Context, userId uuid.UUID) ([]*model.UserRoomLookup, error) {
	var subscriptions []*model.UserRoomLookup
	if err := l.db.NewSelect().Model(&subscriptions).Where("user_id = ?", userId).Scan(ctx, &subscriptions); err != nil {
		return nil, err
	}

	return subscriptions, nil
}
