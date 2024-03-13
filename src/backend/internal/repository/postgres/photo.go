package postgres

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type PhotoDB struct {
	*BaseDB[model.Photo]
}

func NewPhotoDB(db *bun.DB) *PhotoDB {
	type T = model.Photo

	return &PhotoDB{
		BaseDB: NewBaseDB[T](db),
	}
}

func (p *PhotoDB) FindByGalleryId(ctx context.Context, galleryId uuid.UUID) ([]*model.Photo, error) {
	var photos []*model.Photo
	if err := p.db.NewSelect().Model(&photos).Where("gallery_id = ?", galleryId).Scan(ctx, &photos); err != nil {
		return nil, err
	}

	return photos, nil
}
