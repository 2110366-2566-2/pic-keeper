package usecase

import (
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/uptrace/bun"
)

type NotificationUseCase struct {
	NotificationRepo repository.Notification
}

func NewNotificationUseCase(db *bun.DB) *NotificationUseCase {
	return &NotificationUseCase{
		NotificationRepo: postgres.NewNotificationDB(db),
	}
}
