package usecase

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
	"github.com/uptrace/bun"
)

type AdminUseCase struct {
	AdminRepo repository.Admin
}

func NewAdminUseCase(db *bun.DB) *AdminUseCase {
	return &AdminUseCase{
		AdminRepo: postgres.NewAdminDB(db),
	}
}

func (a *AdminUseCase) FindOneByEmail(ctx context.Context, email string) (*model.Administrator, error) {
	return a.AdminRepo.FindOneByEmail(ctx, email)
}

func (a *AdminUseCase) CheckExistenceByEmail(ctx context.Context, email string) (bool, error) {
	return a.AdminRepo.CheckExistenceByEmail(ctx, email)
}
