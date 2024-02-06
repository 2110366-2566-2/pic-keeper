package postgres

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/uptrace/bun"
)

type UserDB struct {
	*BaseDB[model.User]
}

func NewUserDB(db *bun.DB) *UserDB {
	type T = model.User

	return &UserDB{
		BaseDB: NewBaseDB[T](db),
	}
}

func (u *UserDB) FindOneByEmail(ctx context.Context, email string) (*model.User, error) {
	var user model.User
	if err := u.db.NewSelect().Model(&user).Where("email = ?", email).Scan(ctx, &user); err != nil {
		return nil, err
	}
	return &user, nil
}

func (u *UserDB) CheckExistenceByEmail(ctx context.Context, email string) (bool, error) {
	return true, nil
}
