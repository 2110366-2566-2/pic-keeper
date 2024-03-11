package postgres

import (
	"context"

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

func (b *BookingDB) FindByUserId(ctx context.Context, userId uuid.UUID) ([]*model.Booking, error) {
	var bookings []*model.Booking
	if err := b.db.NewSelect().Model(&bookings).Where("customer_id = ?", userId).Scan(ctx, &bookings); err != nil {
		return nil, err
	}

	return bookings, nil
}

func (b *BookingDB) FindByUserIdWithStatus(ctx context.Context, userId uuid.UUID, status string) ([]*model.Booking, error) {
	var bookings []*model.Booking
	if err := b.db.NewSelect().Model(&bookings).Where("customer_id = ? AND status = ?", userId, status).Scan(ctx, &bookings); err != nil {
		return nil, err
	}

	return bookings, nil
}

func (b *BookingDB) FindByPhotographerId(ctx context.Context, phtgId uuid.UUID) ([]*model.Booking, error) {
	var bookings []*model.Booking
	var pkg model.Package

	subq := b.db.NewSelect().Model(&pkg).Where("photographer_id = ?", phtgId).Column("id")

	if err := b.db.NewSelect().Model(&bookings).Where("package_id IN (?)", subq).Scan(ctx, &bookings); err != nil {
		return nil, err
	}

	return bookings, nil
}

func (b *BookingDB) FindByPhotographerIdWithStatus(ctx context.Context, phtgId uuid.UUID, status string) ([]*model.Booking, error) {
	var bookings []*model.Booking
	var pkg model.Package

	subq := b.db.NewSelect().Model(&pkg).Where("photographer_id = ?", phtgId).Column("id")

	if err := b.db.NewSelect().Model(&bookings).Where("package_id IN (?) AND status = ?", subq, status).Scan(ctx, &bookings); err != nil {
		return nil, err
	}

	return bookings, nil
}
