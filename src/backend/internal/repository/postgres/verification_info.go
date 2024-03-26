package postgres

import (
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/uptrace/bun"
)

type VerificationInfoDB struct {
	*BaseDB[model.VerificationInformation]
}

func NewVerificationInfoDB(db *bun.DB) *VerificationInfoDB {
	type T = model.VerificationInformation

	return &VerificationInfoDB{
		BaseDB: NewBaseDB[T](db),
	}
}
