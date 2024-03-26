package postgres

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type ReviewDB struct {
	*BaseDB[model.Review]
}

func NewReviewDB(db *bun.DB) *ReviewDB {
	type T = model.Review

	return &ReviewDB{
		BaseDB: NewBaseDB[T](db),
	}
}

func (p *ReviewDB) FindByUserId(ctx context.Context, userId uuid.UUID) ([]*model.Review, error) {
	var reviews []*model.Review
	if err := p.db.NewSelect().Model(&reviews).Where("customer_id = ?", userId).Scan(ctx, &reviews); err != nil {
		return nil, err
	}

	return reviews, nil
}

func (p *ReviewDB) FindByGalleryId(ctx context.Context, galleryId uuid.UUID) ([]*model.Review, error) {
	var booking model.Booking
	var reviews []*model.Review

	// get all bookings that belong to this galleryId
	allBookingId := p.db.NewSelect().Model(&booking).Where("gallery_id = ?", galleryId).Column("id")

	// get the review that belongs to each of allBookingId
	if err := p.db.NewSelect().Model(&reviews).Where("booking_id IN (?)", allBookingId).Scan(ctx, &reviews); err != nil {
		return nil, err
	}

	return reviews, nil
}
