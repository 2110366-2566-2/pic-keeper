package user

import (
	"github.com/Roongkun/software-eng-ii/internal/usecase"
	"github.com/uptrace/bun"
)

type Resolver struct {
	UserUsecase         usecase.UserUseCase
	PhotographerUsecase usecase.PhotographerUseCase
	PackageUsecase      usecase.GalleryUseCase
	BookingUsecase      usecase.BookingUseCase
}

func NewResolver(db *bun.DB) *Resolver {
	return &Resolver{
		UserUsecase:         *usecase.NewUserUseCase(db),
		PhotographerUsecase: *usecase.NewPhotographerUseCase(db),
		PackageUsecase:      *usecase.NewPackageUseCase(db),
		BookingUsecase:      *usecase.NewBookingUseCase(db),
	}
}
