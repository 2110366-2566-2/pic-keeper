package repository

import "github.com/Roongkun/software-eng-ii/internal/model"

type Photo interface {
	BaseRepo[model.Photo]
}
