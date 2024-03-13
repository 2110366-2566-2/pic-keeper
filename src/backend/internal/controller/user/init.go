package user

import (
	"github.com/Roongkun/software-eng-ii/internal/usecase"
	"github.com/uptrace/bun"
)

type Resolver struct {
	UserUsecase         usecase.UserUseCase
	PhotographerUsecase usecase.PhotographerUseCase
	GalleryUsecase      usecase.GalleryUseCase
	BookingUsecase      usecase.BookingUseCase
	PhotoUsecase        usecase.PhotoUseCase
}

func NewResolver(db *bun.DB) *Resolver {
	return &Resolver{
		UserUsecase:         *usecase.NewUserUseCase(db),
		PhotographerUsecase: *usecase.NewPhotographerUseCase(db),
		GalleryUsecase:      *usecase.NewGalleryUseCase(db),
		BookingUsecase:      *usecase.NewBookingUseCase(db),
		PhotoUsecase:        *usecase.NewPhotoUseCase(db),
	}
}
