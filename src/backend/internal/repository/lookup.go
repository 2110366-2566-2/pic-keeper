package repository

import "github.com/Roongkun/software-eng-ii/internal/model"

type Lookup interface {
	BaseRepo[model.UserRoomLookup]
}
