package usecase

import (
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
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
