package postgres

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type PackageDB struct {
	*BaseDB[model.Gallery]
}

func NewPackageDB(db *bun.DB) *PackageDB {
	type T = model.Gallery

	return &PackageDB{
		BaseDB: NewBaseDB[T](db),
	}
}

func (p *PackageDB) FindByPhotographerId(ctx context.Context, photographerId uuid.UUID) ([]*model.Gallery, error) {
	var packages []*model.Gallery
	if err := p.db.NewSelect().Model(&packages).Where("photographer_id = ?", photographerId).Scan(ctx, &packages); err != nil {
		return nil, err
	}

	return packages, nil
}

func (p *PackageDB) SearchWithFilter(ctx context.Context, filter *model.SearchFilter) ([]*model.Gallery, error) {
	var pkgs []*model.Gallery
	query := p.db.NewSelect().Model(&pkgs)

	if filter.PhotographerId != nil {
		query.Where("photographer_id = ?", *filter.PhotographerId)
	}

	if filter.Location != nil {
		query.Where("location = ?", *filter.Location)
	}

	if filter.MinPrice != nil {
		query.Where("price >= ?", *filter.MinPrice)
	}
	if filter.MaxPrice != nil {
		query.Where("price <= ?", *filter.MaxPrice)
	}

	if err := query.Scan(ctx, &pkgs); err != nil {
		return nil, err
	}

	return pkgs, nil
}
