package repository

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
)

type Issue interface {
	BaseRepo[model.Issue]
	FindIssuesWithFilters(ctx context.Context, filters model.IssueFilter) ([]*model.Issue, error)
}
