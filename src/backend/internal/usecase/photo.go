package usecase

import (
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
	"github.com/uptrace/bun"
)

type PhotoUseCase struct {
	PhotoRepo repository.Photo
}

func NewPhotoUseCase(db *bun.DB) *PhotoUseCase {
	return &PhotoUseCase{
		PhotoRepo: postgres.NewPhotoDB(db),
	}
}
