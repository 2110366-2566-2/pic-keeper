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

func (i *IssueUseCase) FindIssuesWithFilter(ctx context.Context, filter model.IssueFilter) ([]*model.Issue, error) {
	return i.IssueRepo.FindIssuesWithFilter(ctx, filter)
}

func (i *IssueUseCase) GetIssueHeaderMetadata(ctx context.Context) (*model.IssueHeaderMetadata, error) {
	return i.IssueRepo.GetIssueHeaderMetadata(ctx)
}
