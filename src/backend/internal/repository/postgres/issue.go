package postgres

import (
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/uptrace/bun"
)

type IssueDB struct {
	*BaseDB[model.Issue]
}

func NewIssueDB(db *bun.DB) *IssueDB {
	type T = model.Issue

	return &IssueDB{
		BaseDB: NewBaseDB[T](db),
	}
}
