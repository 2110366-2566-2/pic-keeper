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

func (r *ReviewDB) FindByGalleryId(ctx context.Context, galleryId uuid.UUID) ([]*model.Review, error) {
	var reviews []*model.Review

	var room model.Room
	allRoomIds := r.db.NewSelect().Model(&room).Where("gallery_id = ?", galleryId).Column("id")

	var booking model.Booking
	allBookingIds := r.db.NewSelect().Model(&booking).Where("room_id IN (?)", allRoomIds).Column("id")

	if err := r.db.NewSelect().Model(&reviews).Where("booking_id IN (?)", allBookingIds).Scan(ctx, &reviews); err != nil {
		return nil, err
	}

	return reviews, nil
}

func (r *ReviewDB) FindByPhotographerId(ctx context.Context, photographerId uuid.UUID) ([]*model.Review, error) {
	var gallery model.Gallery
	var reviews []*model.Review

	allGalleryIds := r.db.NewSelect().Model(&gallery).Where("photographer_id = ?", photographerId).Column("id")

	var room model.Room
	allRoomIds := r.db.NewSelect().Model(&room).Where("gallery_id IN (?)", allGalleryIds).Column("id")

	var booking model.Booking
	allBookingIds := r.db.NewSelect().Model(&booking).Where("room_id IN (?)", allRoomIds).Column("id")

	if err := r.db.NewSelect().Model(&reviews).Where("booking_id IN (?)", allBookingIds).Scan(ctx, &reviews); err != nil {
		return nil, err
	}

	return reviews, nil
}

func (r *ReviewDB) CheckExistenceByGalleryId(ctx context.Context, galleryId uuid.UUID) (bool, error) {
	var room model.Room
	allRoomIds := r.db.NewSelect().Model(&room).Where("gallery_id = ?", galleryId).Column("id")

	var booking model.Booking
	allBookingIds := r.db.NewSelect().Model(&booking).Where("room_id IN (?)", allRoomIds).Column("id")

	var review model.Review
	exist, err := r.db.NewSelect().Model(&review).Where("booking_id IN (?)", allBookingIds).Exists(ctx)
	if err != nil {
		return false, err
	}

	return exist, nil
}

func (r *ReviewDB) SumAndCountRatingByGalleryId(ctx context.Context, galleryId uuid.UUID) (int, int, error) {
	var room model.Room
	allRoomIds := r.db.NewSelect().Model(&room).Where("gallery_id = ?", galleryId).Column("id")

	var booking model.Booking
	allBookingIds := r.db.NewSelect().Model(&booking).Where("room_id IN (?)", allRoomIds).Column("id")

	var review model.Review
	var sum int
	count, err := r.db.NewSelect().Model(&review).Where("booking_id IN (?)", allBookingIds).ColumnExpr("SUM(rating)").ScanAndCount(ctx, &sum)
	if err != nil {
		return 0, 0, err
	}

	return sum, count, nil
}
