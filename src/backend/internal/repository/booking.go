package repository

import "github.com/Roongkun/software-eng-ii/internal/model"

type Booking interface {
	BaseRepo[model.Booking]
}
