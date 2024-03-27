package repository

import (
	"context"
	"time"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
)

type Booking interface {
	BaseRepo[model.Booking]
	FindByUserIdWithStatus(ctx context.Context, userId uuid.UUID, status ...string) ([]*model.Booking, error)
	FindByPhotographerIdWithStatus(ctx context.Context, phtgId uuid.UUID, status ...string) ([]*model.Booking, error)
	UpdateStatusRoutine(ctx context.Context, currentTime time.Time) error
	ListPendingRefundBookings(ctx context.Context) ([]*model.Booking, error)
	FindByRoomId(ctx context.Context, roomId uuid.UUID) (*model.Booking, error)
}
