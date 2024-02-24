package repository

import "github.com/Roongkun/software-eng-ii/internal/model"

type Room interface {
	BaseRepo[model.Room]
}
