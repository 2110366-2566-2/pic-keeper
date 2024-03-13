package postgres

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type GalleryDB struct {
	*BaseDB[model.Gallery]
}

func NewGalleryDB(db *bun.DB) *GalleryDB {
	type T = model.Gallery

	return &GalleryDB{
		BaseDB: NewBaseDB[T](db),
	}
}

func (p *GalleryDB) FindByPhotographerId(ctx context.Context, photographerId uuid.UUID) ([]*model.Gallery, error) {
	var galleries []*model.Gallery
	if err := p.db.NewSelect().Model(&galleries).Where("photographer_id = ?", photographerId).Scan(ctx, &galleries); err != nil {
		return nil, err
	}

	return galleries, nil
}

func (p *GalleryDB) SearchWithFilter(ctx context.Context, filter *model.SearchFilter) ([]*model.Gallery, error) {
	var galleries []*model.Gallery
	query := p.db.NewSelect().Model(&galleries)

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

	if err := query.Scan(ctx, &galleries); err != nil {
		return nil, err
	}

	return galleries, nil
}
