package photographer

import (
	"github.com/Roongkun/software-eng-ii/internal/usecase"
	"github.com/uptrace/bun"
)

type Resolver struct {
	PhotographerUsecase usecase.PhotographerUseCase
	GalleryUsecase      usecase.GalleryUseCase
	PhotoUsecase        usecase.PhotoUseCase
	BookingUsecase      usecase.BookingUseCase
}

func NewResolver(db *bun.DB) *Resolver {
	return &Resolver{
		PhotographerUsecase: *usecase.NewPhotographerUseCase(db),
		GalleryUsecase:      *usecase.NewGalleryUseCase(db),
		PhotoUsecase:        *usecase.NewPhotoUseCase(db),
		BookingUsecase:      *usecase.NewBookingUseCase(db),
	}
}
