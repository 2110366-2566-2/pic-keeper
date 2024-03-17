package repository

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
)

type Notification interface {
	BaseRepo[model.Notification]
	GetAllUnreadByUserId(ctx context.Context, userId uuid.UUID) ([]*model.Notification, error)
}
