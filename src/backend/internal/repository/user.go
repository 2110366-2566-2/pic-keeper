package repository

import "github.com/Roongkun/software-eng-ii/internal/model"

type User interface {
	BaseRepo[model.User]
}
