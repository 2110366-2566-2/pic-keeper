package usecase

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type BookingUseCase struct {
	BookingRepo repository.Booking
}

func NewBookingUseCase(db *bun.DB) *BookingUseCase {
	return &BookingUseCase{
		BookingRepo: postgres.NewBookingDB(db),
	}
}

func (b *BookingUseCase) FindByUserId(ctx context.Context, userId uuid.UUID) ([]*model.Booking, error) {
	return b.BookingRepo.FindByUserId(ctx, userId)
}

func (b *BookingUseCase) FindByUserIdWithStatus(ctx context.Context, userId uuid.UUID, bkStatus string) ([]*model.Booking, error) {
	return b.BookingRepo.FindByUserIdWithStatus(ctx, userId, bkStatus)
}
