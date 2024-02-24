package postgres

import (
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/uptrace/bun"
)

type LookupDB struct {
	*BaseDB[model.UserRoomLookup]
}

func NewLookupDB(db *bun.DB) *LookupDB {
	type T = model.UserRoomLookup

	return &LookupDB{
		BaseDB: NewBaseDB[T](db),
	}
}
