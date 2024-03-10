package postgres

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type PackageDB struct {
	*BaseDB[model.Package]
}

func NewPackageDB(db *bun.DB) *PackageDB {
	type T = model.Package

	return &PackageDB{
		BaseDB: NewBaseDB[T](db),
	}
}

func (p *PackageDB) FindByPhotographerId(ctx context.Context, photographerId uuid.UUID) ([]*model.Package, error) {
	var packages []*model.Package
	if err := p.db.NewSelect().Model(&packages).Where("photographer_id = ?", photographerId).Scan(ctx, &packages); err != nil {
		return nil, err
	}

	return packages, nil
}
