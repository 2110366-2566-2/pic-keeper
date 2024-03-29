package usecase

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type LookupUseCase struct {
	LookupRepo repository.Lookup
}

func NewLookupUseCase(db *bun.DB) *LookupUseCase {
	return &LookupUseCase{
		LookupRepo: postgres.NewLookupDB(db),
	}
}

func (l *LookupUseCase) FindByUserId(ctx context.Context, userId uuid.UUID) ([]*model.UserRoomLookup, error) {
	return l.LookupRepo.FindByUserId(ctx, userId)
}

func (l *LookupUseCase) CheckRoomMembership(ctx context.Context, userId uuid.UUID, roomId uuid.UUID) (bool, error) {
	return l.LookupRepo.CheckRoomMembership(ctx, userId, roomId)
}
