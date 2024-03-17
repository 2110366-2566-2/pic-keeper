package usecase

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
	"github.com/google/uuid"
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

func (n *NotificationUseCase) GetAllUnreadByUserId(ctx context.Context, userId uuid.UUID) ([]*model.Notification, error) {
	return n.NotificationRepo.GetAllUnreadByUserId(ctx, userId)
}
