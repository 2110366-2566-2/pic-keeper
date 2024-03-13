package postgres

import (
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/uptrace/bun"
)

type PhotoDB struct {
	*BaseDB[model.Photo]
}

func NewPhotoDB(db *bun.DB) *PhotoDB {
	type T = model.Photo

	return &PhotoDB{
		BaseDB: NewBaseDB[T](db),
	}
}
