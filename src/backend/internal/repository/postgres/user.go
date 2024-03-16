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
	var user model.User

	exist, err := u.db.NewSelect().Model(&user).Where("email = ?", email).Exists(ctx)

	if err != nil {
		return false, err
	}

	return exist, nil
}

func (u *UserDB) ListPendingPhotographers(ctx context.Context) ([]*model.User, error) {
	var pendingPhotographers []*model.User
	if err := u.db.NewSelect().Model(&pendingPhotographers).Where("verification_status = ?", model.PhotographerVerifiedStatus).Scan(ctx, &pendingPhotographers); err != nil {
		return nil, err
	}

	return pendingPhotographers, nil
}

func (u *UserDB) FindOneByUsername(ctx context.Context, username string) (*model.User, error) {
	var user model.User
	if err := u.db.NewSelect().Model(&user).Where("username = ?", username).Scan(ctx, &user); err != nil {
		return nil, err
	}
	return &user, nil
}
