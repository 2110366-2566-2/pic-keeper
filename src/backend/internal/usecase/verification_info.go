package usecase

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type VerificationTicketUseCase struct {
	VerificationInfoRepo repository.VerificationTicket
}

func NewVerificationTicketUseCase(db *bun.DB) *VerificationTicketUseCase {
	return &VerificationTicketUseCase{
		VerificationInfoRepo: postgres.NewVerificationInfoDB(db),
	}
}

func (v *VerificationTicketUseCase) FindByUserIds(ctx context.Context, phtgIds []uuid.UUID) ([]*model.VerificationTicket, error) {
	return v.VerificationInfoRepo.FindByUserIds(ctx, phtgIds)
}
