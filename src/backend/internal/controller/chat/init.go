package chat

import (
	"github.com/Roongkun/software-eng-ii/internal/usecase"
	"github.com/uptrace/bun"
)

type Resolver struct {
	RoomUsecase         usecase.RoomUseCase
	LookupUsecase       usecase.LookupUseCase
	ConversationUsecase usecase.ConversationUseCase
	UserUsecase         usecase.UserUseCase
}

func NewResolver(db *bun.DB) *Resolver {
	return &Resolver{
		RoomUsecase:         *usecase.NewRoomUseCase(db),
		LookupUsecase:       *usecase.NewLookupUseCase(db),
		ConversationUsecase: *usecase.NewConversationUseCase(db),
		UserUsecase:         *usecase.NewUserUseCase(db),
	}
}
