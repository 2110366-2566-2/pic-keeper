package usecase

import (
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
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
