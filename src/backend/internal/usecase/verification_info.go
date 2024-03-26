package usecase

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type VerificationInfoUseCase struct {
	VerificationInfoRepo repository.VerificationInfo
}

func NewVerificationUseCase(db *bun.DB) *VerificationInfoUseCase {
	return &VerificationInfoUseCase{
		VerificationInfoRepo: postgres.NewVerificationInfoDB(db),
	}
}

func (v *VerificationInfoUseCase) FindByUserIds(ctx context.Context, phtgIds []uuid.UUID) ([]*model.VerificationInformation, error) {
	return v.VerificationInfoRepo.FindByUserIds(ctx, phtgIds)
}
