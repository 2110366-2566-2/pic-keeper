package repository

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
)

type Notification interface {
	BaseRepo[model.Notification]
	GetAllUnreadByUserIdWithRoomOption(ctx context.Context, userId uuid.UUID, roomId ...uuid.UUID) ([]*model.Notification, error)
	ReadNotificationFromThisRoom(ctx context.Context, updatedNoti []*model.Notification) error
}
