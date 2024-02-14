package postgres

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/uptrace/bun"
)

type AdminDB struct {
	*BaseDB[model.Administrator]
}

func NewAdminDB(db *bun.DB) *AdminDB {
	type T = model.Administrator

	return &AdminDB{
		BaseDB: NewBaseDB[T](db),
	}
}

func (a *AdminDB) FindOneByEmail(ctx context.Context, email string) (*model.Administrator, error) {
	var admin model.Administrator
	if err := a.db.NewSelect().Model(&admin).Where("email = ?", email).Scan(ctx, &admin); err != nil {
		return nil, err
	}
	return &admin, nil
}

func (a *AdminDB) CheckExistenceByEmail(ctx context.Context, email string) (bool, error) {
	var admin model.Administrator

	exist, err := a.db.NewSelect().Model(&admin).Where("email = ?", email).Exists(ctx)

	if err != nil {
		return false, err
	}

	return exist, nil
}
