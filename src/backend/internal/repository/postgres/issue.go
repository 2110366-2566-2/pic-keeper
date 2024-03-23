package postgres

import (
	"context"

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

func (i *IssueDB) FindIssuesWithFilter(ctx context.Context, filters model.IssueFilter) ([]*model.Issue, error) {
	var issues []*model.Issue
	query := i.db.NewSelect().Model(&issues)

	if filters.Subject != nil {
		query = query.Where("subject = ?", *filters.Subject)
	}
	if filters.CreatedAt != nil {
		query = query.Where("created_at = ?", *filters.CreatedAt)
	}
	if filters.DueDate != nil {
		query = query.Where("due_date = ?", *filters.DueDate)
	}
	if filters.ReporterId != nil {
		query = query.Where("reporter_id = ?", *filters.ReporterId)
	}
	if filters.Status != nil {
		query = query.Where("status = ?", *filters.Status)
	}

	if err := query.Scan(ctx, &issues); err != nil {
		return nil, err
	}

	return issues, nil
}

func (i *IssueDB) FindHeaderMetadata(ctx context.Context) ([]*model.IssueHeaderMetadata, error) {
}
