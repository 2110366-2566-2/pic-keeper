package postgres

import (
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/uptrace/bun"
)

type PackageDB struct {
	*BaseDB[model.Package]
}

func NewPackageDB(db *bun.DB) *PackageDB {
	type T = model.Package

	return &PackageDB{
		BaseDB: NewBaseDB[T](db),
	}
}
