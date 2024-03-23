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

func (n *NotificationDB) GetAllUnreadByUserIdWithRoomOption(ctx context.Context, userId uuid.UUID, roomId ...uuid.UUID) ([]*model.Notification, error) {
	var allNotis []*model.Notification
	if roomId == nil {
		if err := n.db.NewSelect().Model(&allNotis).Where("noticed = FALSE AND user_id = ?", userId).Scan(ctx, &allNotis); err != nil {
			return nil, err
		}
	} else {
		if err := n.db.NewSelect().Model(&allNotis).Where("noticed = FALSE AND user_id = ? AND room_id IN (?)", userId, bun.In(roomId)).Scan(ctx, &allNotis); err != nil {
			return nil, err
		}
	}

	return allNotis, nil
}

func (n *NotificationDB) ReadNotificationFromThisRoom(ctx context.Context, updatedNoti []*model.Notification) error {
	_, err := n.db.NewUpdate().Model(&updatedNoti).Column("noticed").Bulk().Exec(ctx)
	return err
}
