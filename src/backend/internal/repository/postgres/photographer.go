package postgres

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/uptrace/bun"
)

type PhotographerDB struct {
	*BaseDB[model.Photographer]
}

func NewPhotographerDB(db *bun.DB) *PhotographerDB {
	type T = model.Photographer

	return &PhotographerDB{
		BaseDB: NewBaseDB[T](db),
	}
}

func (p *PhotographerDB) ListUnverifiedPhotographers(ctx context.Context) ([]*model.Photographer, error) {
	var unvrfPhotographers []*model.Photographer
	if err := p.db.NewSelect().Model(&unvrfPhotographers).Where("is_verified = FALSE").Scan(ctx, &unvrfPhotographers); err != nil {
		return nil, err
	}

	return unvrfPhotographers, nil
}
