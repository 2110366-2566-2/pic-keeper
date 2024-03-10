package usecase

import (
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
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
