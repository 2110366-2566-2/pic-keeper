package postgres

import (
	"github.com/Roongkun/software-eng-ii/internal/model"
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
