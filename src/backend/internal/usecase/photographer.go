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

func (u *PhotographerUseCase) FindOneByEmail(ctx context.Context, email string) (*model.Photographer, error) {
	return u.PhotographerRepo.FindOneByEmail(ctx, email)
}

func (u *PhotographerUseCase) CheckExistenceByEmail(ctx context.Context, email string) (bool, error) {
	return u.PhotographerRepo.CheckExistenceByEmail(ctx, email)
}

func (p *PhotographerUseCase) ListUnverifiedPhotographers(ctx context.Context) ([]*model.Photographer, error) {
	return p.PhotographerRepo.ListUnverifiedPhotographers(ctx)
}
