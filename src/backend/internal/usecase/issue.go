package usecase

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
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

func (i *IssueUseCase) FindIssuesWithFilter(ctx context.Context, filters model.IssueFilter) ([]*model.Issue, error) {
	return i.IssueRepo.FindIssuesWithFilter(ctx, filters)
}
