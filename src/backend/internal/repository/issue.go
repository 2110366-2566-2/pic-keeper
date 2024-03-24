package repository

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
)

type Issue interface {
	BaseRepo[model.Issue]
	FindIssuesWithFilter(ctx context.Context, filter model.IssueFilter) ([]*model.Issue, error)
	GetIssueHeaderMetadata(ctx context.Context) (*model.IssueHeaderMetadata, error)
}
