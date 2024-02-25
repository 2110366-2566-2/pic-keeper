package usecase

import (
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
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

// func (l *LookupUseCase) FindByUserId(ctx context.Context, userId uuid.UUID) ([]*uuid.UUID, error) {
// 	return l.LookupRepo.FindByUserId(ctx, userId)
// }
