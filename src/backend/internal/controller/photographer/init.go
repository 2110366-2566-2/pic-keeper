package photographer

import (
	"github.com/Roongkun/software-eng-ii/internal/usecase"
	"github.com/uptrace/bun"
)

type Resolver struct {
	GalleryUsecase usecase.GalleryUseCase
	PhotoUsecase   usecase.PhotoUseCase
	BookingUsecase usecase.BookingUseCase
	ReviewUsecase  usecase.ReviewUseCase
	UserUsecase    usecase.UserUseCase
}

func NewResolver(db *bun.DB) *Resolver {
	return &Resolver{
		GalleryUsecase: *usecase.NewGalleryUseCase(db),
		PhotoUsecase:   *usecase.NewPhotoUseCase(db),
		BookingUsecase: *usecase.NewBookingUseCase(db),
		ReviewUsecase:  *usecase.NewReviewUseCase(db),
		UserUsecase:    *usecase.NewUserUseCase(db),
	}
}
