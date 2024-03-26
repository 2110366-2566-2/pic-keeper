package room

import (
	"github.com/Roongkun/software-eng-ii/internal/usecase"
	"github.com/uptrace/bun"
)

type Resolver struct {
	RoomUsecase         usecase.RoomUseCase
	GalleryUsecase      usecase.GalleryUseCase
	LookupUsecase       usecase.LookupUseCase
	ConversationUsecase usecase.ConversationUseCase
	UserUsecase         usecase.UserUseCase
}

func NewResolver(db *bun.DB) *Resolver {
	return &Resolver{
		RoomUsecase:         *usecase.NewRoomUseCase(db),
		GalleryUsecase:      *usecase.NewGalleryUseCase(db),
		LookupUsecase:       *usecase.NewLookupUseCase(db),
		ConversationUsecase: *usecase.NewConversationUseCase(db),
		UserUsecase:         *usecase.NewUserUseCase(db),
	}
}
