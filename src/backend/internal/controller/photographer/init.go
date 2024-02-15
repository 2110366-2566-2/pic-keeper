package photographer

import (
	"github.com/Roongkun/software-eng-ii/internal/usecase"
	"github.com/uptrace/bun"
)

type Resolver struct {
	PhotographerUsecase usecase.PhotographerUseCase
	UserUsecase         usecase.UserUseCase
}

func NewResolver(db *bun.DB) *Resolver {
	return &Resolver{
		PhotographerUsecase: *usecase.NewPhotographerUseCase(db),
		UserUsecase:         *usecase.NewUserUseCase(db),
	}
}
