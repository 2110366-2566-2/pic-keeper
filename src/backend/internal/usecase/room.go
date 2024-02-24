package usecase

import (
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
	"github.com/uptrace/bun"
)

type RoomUseCase struct {
	RoomRepo repository.Room
}

func NewRoomUseCase(db *bun.DB) *RoomUseCase {
	return &RoomUseCase{
		RoomRepo: postgres.NewRoomDB(db),
	}
}
