package admin

import (
	"github.com/Roongkun/software-eng-ii/internal/usecase"
	"github.com/uptrace/bun"
)

type Resolver struct {
	UserUsecase    usecase.UserUseCase
	BookingUsecase usecase.BookingUseCase
	IssueUsecase   usecase.IssueUseCase
	RoomUsecase    usecase.RoomUseCase
	GalleryUsecase usecase.GalleryUseCase
}

func NewResolver(db *bun.DB) *Resolver {
	return &Resolver{
		UserUsecase:    *usecase.NewUserUseCase(db),
		BookingUsecase: *usecase.NewBookingUseCase(db),
		IssueUsecase:   *usecase.NewIssueUseCase(db),
		RoomUsecase:    *usecase.NewRoomUseCase(db),
		GalleryUsecase: *usecase.NewGalleryUseCase(db),
	}
}
