package postgres

import (
	"context"
	"time"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type BookingDB struct {
	*BaseDB[model.Booking]
}

func NewBookingDB(db *bun.DB) *BookingDB {
	type T = model.Booking

	return &BookingDB{
		BaseDB: NewBaseDB[T](db),
	}
}

func (b *BookingDB) FindByUserIdWithStatus(ctx context.Context, userId uuid.UUID, status ...string) ([]*model.Booking, error) {
	var bookings []*model.Booking
	query := b.db.NewSelect().Model(&bookings)

	for _, acceptedStatus := range status {
		query = query.WhereOr("status = ?", acceptedStatus)
	}

	query = query.WhereGroup(" AND ", func(q *bun.SelectQuery) *bun.SelectQuery {
		return q.Where("customer_id = ?", userId)
	})

	if err := query.Scan(ctx, &bookings); err != nil {
		return nil, err
	}

	return bookings, nil
}

func (b *BookingDB) FindByPhotographerIdWithStatus(ctx context.Context, phtgId uuid.UUID, status ...string) ([]*model.Booking, error) {
	var bookings []*model.Booking
	var pkg model.Package

	subq := b.db.NewSelect().Model(&pkg).Where("photographer_id = ?", phtgId).Column("id")

	query := b.db.NewSelect().Model(&bookings)

	for _, acceptedStatus := range status {
		query = query.WhereOr("status = ?", acceptedStatus)
	}

	query = query.WhereGroup(" AND ", func(q *bun.SelectQuery) *bun.SelectQuery {
		return q.Where("package_id IN (?)", subq)
	})

	if err := query.Scan(ctx, &bookings); err != nil {
		return nil, err
	}

	return bookings, nil
}

func (b *BookingDB) UpdateStatusRoutine(ctx context.Context, currentTime time.Time) error {
	var booking model.Booking
	paidOutTime := currentTime.Add(time.Hour * 24 * 3)

	_, err := b.db.NewUpdate().Model(&booking).Set("status = ?", model.BookingCompletedStatus).Where("status = ? AND end_time <= ?", model.BookingPaidStatus, currentTime).Exec(ctx)
	if err != nil {
		return err
	}

	_, err = b.db.NewUpdate().Model(&booking).Set("status = ?", model.BookingPaidOutStatus).Where("status != ? AND end_time <= ?", model.BookingPaidOutStatus, paidOutTime).Exec(ctx)
	if err != nil {
		return err
	}

	return nil
}
