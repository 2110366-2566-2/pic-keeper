package usecase

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
	"github.com/uptrace/bun"
)

type PhotographerUseCase struct {
	PhotographerRepo repository.Photographer
}

func NewPhotographerUseCase(db *bun.DB) *PhotographerUseCase {
	return &PhotographerUseCase{
		PhotographerRepo: postgres.NewPhotographerDB(db),
	}
}

func (p *PhotographerUseCase) ListUnverifiedPhotographers(ctx context.Context) ([]*model.Photographer, error) {
	return p.PhotographerRepo.ListUnverifiedPhotographers(ctx)
}
