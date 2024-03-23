package usecase

import (
	"github.com/Roongkun/software-eng-ii/internal/repository"
	"github.com/Roongkun/software-eng-ii/internal/repository/postgres"
	"github.com/uptrace/bun"
)

type IssueUseCase struct {
	IssueRepo repository.Issue
}

func NewIssueUseCase(db *bun.DB) *IssueUseCase {
	return &IssueUseCase{
		IssueRepo: postgres.NewIssueDB(db),
	}
}
