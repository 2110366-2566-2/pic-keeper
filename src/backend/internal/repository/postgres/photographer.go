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

func (u *PhotographerDB) FindOneByEmail(ctx context.Context, email string) (*model.Photographer, error) {
	var user model.Photographer
	if err := u.db.NewSelect().Model(&user).Where("email = ?", email).Scan(ctx, &user); err != nil {
		return nil, err
	}
	return &user, nil
}

func (u *PhotographerDB) CheckExistenceByEmail(ctx context.Context, email string) (bool, error) {
	var user model.Photographer

	exist, err := u.db.NewSelect().Model(&user).Where("email = ?", email).Exists(ctx)

	if err != nil {
		return false, err
	}

	return exist, nil
}

func (p *PhotographerDB) ListUnverifiedPhotographers(ctx context.Context) ([]*model.Photographer, error) {
	var unvrfPhotographers []*model.Photographer
	if err := p.db.NewSelect().Model(&unvrfPhotographers).Where("is_verified = FALSE").Scan(ctx, &unvrfPhotographers); err != nil {
		return nil, err
	}

	return unvrfPhotographers, nil
}
