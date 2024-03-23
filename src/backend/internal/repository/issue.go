package repository

import "github.com/Roongkun/software-eng-ii/internal/model"

type Issue interface {
	BaseRepo[model.Issue]
}
