package postgres

import (
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/uptrace/bun"
)

type BookingDB struct {
	*BaseDB[model.Booking]
}

func NewBookingDB(db *bun.DB) *BookingDB {
	type T = model.Booking

	return &BookingDB{
		BaseDB: NewBaseDB[T](db),
	}
}
