package usecase

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type UserUseCase struct {
	UserRepo repository.User
}

func NewUserUseCase(db *bun.DB) *UserUseCase {
	return &UserUseCase{
		UserRepo: postgres.NewUserDB(db),
	}
}

func (u *UserUseCase) FindOneByEmail(ctx context.Context, email string) (*model.User, error) {
	return u.UserRepo.FindOneByEmail(ctx, email)
}

func (u *UserUseCase) CheckExistenceByEmail(ctx context.Context, email string) (bool, error) {
	return u.UserRepo.CheckExistenceByEmail(ctx, email)
}

func (u *UserUseCase) ListPendingPhotographers(ctx context.Context) ([]*model.User, error) {
	return u.UserRepo.ListPendingPhotographers(ctx)
}

func (u *UserUseCase) FindOneByUsername(ctx context.Context, username string) (*model.User, error) {
	return u.UserRepo.FindOneByEmail(ctx, username)
}

func (u *UserUseCase) CheckUsernameAlreadyBeenUsed(ctx context.Context, username string, proposedUserId uuid.UUID) (bool, error) {
	return u.UserRepo.CheckUsernameAlreadyBeenUsed(ctx, username, proposedUserId)
}
