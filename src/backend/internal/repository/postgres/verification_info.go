package postgres

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type VerificationInfoDB struct {
	*BaseDB[model.VerificationInformation]
}

func NewVerificationInfoDB(db *bun.DB) *VerificationInfoDB {
	type T = model.VerificationInformation

	return &VerificationInfoDB{
		BaseDB: NewBaseDB[T](db),
	}
}

func (v *VerificationInfoDB) FindByUserIds(ctx context.Context, phtgIds []uuid.UUID) ([]*model.VerificationInformation, error) {
	var verificationInfo []*model.VerificationInformation

	if err := v.db.NewSelect().Model(&verificationInfo).Where("user_id IN (?)", bun.In(phtgIds)).Scan(ctx, &verificationInfo); err != nil {
		return nil, err
	}

	return verificationInfo, nil
}
