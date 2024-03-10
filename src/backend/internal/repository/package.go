package repository

import "github.com/Roongkun/software-eng-ii/internal/model"

type Package interface {
	BaseRepo[model.Package]
}
