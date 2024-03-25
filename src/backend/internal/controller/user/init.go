package user

import (
	"github.com/Roongkun/software-eng-ii/internal/usecase"
	"github.com/uptrace/bun"
)

type Resolver struct {
	UserUsecase    usecase.UserUseCase
	GalleryUsecase usecase.GalleryUseCase
	BookingUsecase usecase.BookingUseCase
	PhotoUsecase   usecase.PhotoUseCase
	ReviewUsecase  usecase.ReviewUseCase
}

func NewResolver(db *bun.DB) *Resolver {
	return &Resolver{
		UserUsecase:    *usecase.NewUserUseCase(db),
		GalleryUsecase: *usecase.NewGalleryUseCase(db),
		BookingUsecase: *usecase.NewBookingUseCase(db),
		PhotoUsecase:   *usecase.NewPhotoUseCase(db),
		ReviewUsecase:  *usecase.NewReviewUseCase(db),
	}
}
