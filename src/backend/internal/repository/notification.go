package repository

import "github.com/Roongkun/software-eng-ii/internal/model"

type Notification interface {
	BaseRepo[model.Notification]
}
