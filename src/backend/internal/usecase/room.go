package usecase

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type RoomUseCase struct {
	RoomRepo repository.Room
}

func NewRoomUseCase(db *bun.DB) *RoomUseCase {
	return &RoomUseCase{
		RoomRepo: postgres.NewRoomDB(db),
	}
}

func (r *RoomUseCase) FindByUserId(ctx context.Context, userId uuid.UUID) ([]*model.Room, error) {
	return r.RoomRepo.FindByUserId(ctx, userId)
}
