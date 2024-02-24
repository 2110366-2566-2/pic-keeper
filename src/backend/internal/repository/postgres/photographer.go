package postgres

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
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

func (p *PhotographerDB) CheckExistenceByUserId(ctx context.Context, userId uuid.UUID) (bool, error) {
	var exist bool
	var err error
	model := new(model.Photographer)
	if exist, err = p.db.NewSelect().Model(model).Where("user_id = ?", userId).Exists(ctx); err != nil {
		return false, err
	}

	return exist, nil
}
