package user

import (
	"github.com/Roongkun/software-eng-ii/internal/usecase"
	"github.com/uptrace/bun"
)

type Resolver struct {
	UserUsecase         usecase.UserUseCase
	PhotographerUsecase usecase.PhotographerUseCase
	BookingUsecase      usecase.BookingUseCase
}

func NewResolver(db *bun.DB) *Resolver {
	return &Resolver{
		UserUsecase:         *usecase.NewUserUseCase(db),
		PhotographerUsecase: *usecase.NewPhotographerUseCase(db),
		BookingUsecase:      *usecase.NewBookingUseCase(db),
	}
}
