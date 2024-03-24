package postgres

import (
	"context"
	"time"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
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

func (i *IssueDB) FindIssuesWithFilter(ctx context.Context, filter model.IssueFilter) ([]*model.Issue, error) {
	var issues []*model.Issue
	query := i.db.NewSelect().Model(&issues)

	if filter.Subject != nil {
		query = query.Where("subject = ?", *filter.Subject)
	}
	if filter.CreatedAt != nil {
		query = query.Where("created_at = ?", *filter.CreatedAt)
	}
	if filter.DueDate != nil {
		query = query.Where("due_date = ?", *filter.DueDate)
	}
	if filter.ReporterId != nil {
		query = query.Where("reporter_id = ?", uuid.MustParse(*filter.ReporterId))
	}
	if filter.Status != nil {
		query = query.Where("status = ?", *filter.Status)
	}

	if err := query.Scan(ctx, &issues); err != nil {
		return nil, err
	}

	return issues, nil
}

func (i *IssueDB) GetIssueHeaderMetadata(ctx context.Context) (*model.IssueHeaderMetadata, error) {
	var issue model.Issue
	var result model.IssueHeaderMetadata

	count, err := i.db.NewSelect().Model(&issue).Where("status = ?", model.IssueOpenStatus).Count(ctx)
	if err != nil {
		return nil, err
	}
	result.PendingTickets = count

	date := time.Now().Format("2006-01-02")
	count, err = i.db.NewSelect().Model(&issue).Where("DATE(created_at) = ?", date).Count(ctx)
	if err != nil {
		return nil, err
	}
	result.TicketsToday = count

	count, err = i.db.NewSelect().Model(&issue).Where("DATE(due_date) = ?", date).Count(ctx)
	if err != nil {
		return nil, err
	}
	result.TicketsDueToday = count

	count, err = i.db.NewSelect().Model(&issue).Where("status = ?", model.IssueClosedStatus).Count(ctx)
	if err != nil {
		return nil, err
	}
	result.ClosedTickets = count

	return &result, nil
}
