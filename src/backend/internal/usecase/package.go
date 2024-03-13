package usecase

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type PackageUseCase struct {
	PackageRepo repository.Package
}

func NewPackageUseCase(db *bun.DB) *PackageUseCase {
	return &PackageUseCase{
		PackageRepo: postgres.NewPackageDB(db),
	}
}

func (p *PackageUseCase) FindByPhotographerId(ctx context.Context, photographerId uuid.UUID) ([]*model.Package, error) {
	return p.PackageRepo.FindByPhotographerId(ctx, photographerId)
}

func (p *PackageUseCase) SearchWithFilter(ctx context.Context, filter *model.SearchFilter) ([]*model.Package, error) {
	return p.PackageRepo.SearchWithFilter(ctx, filter)
}
