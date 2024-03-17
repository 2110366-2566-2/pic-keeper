package postgres

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type NotificationDB struct {
	*BaseDB[model.Notification]
}

func NewNotificationDB(db *bun.DB) *NotificationDB {
	type T = model.Notification

	return &NotificationDB{
		BaseDB: NewBaseDB[T](db),
	}
}

func (n *NotificationDB) GetAllUnreadByUserId(ctx context.Context, userId uuid.UUID) ([]*model.Notification, error) {
	var allNotis []*model.Notification
	if err := n.db.NewSelect().Model(&allNotis).Where("noticed = FALSE AND user_id = ?", userId).Scan(ctx, &allNotis); err != nil {
		return nil, err
	}

	return allNotis, nil
}
