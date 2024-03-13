package usecase

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
	"github.com/google/uuid"
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

func (p *PhotographerUseCase) CheckExistenceByUserId(ctx context.Context, userId uuid.UUID) (bool, error) {
	return p.PhotographerRepo.CheckExistenceByUserId(ctx, userId)
}

func (p *PhotographerUseCase) FindOneByUserId(ctx context.Context, userId uuid.UUID) (*model.Photographer, error) {
	return p.PhotographerRepo.FindOneByUserId(ctx, userId)
}
