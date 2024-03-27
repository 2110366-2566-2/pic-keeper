package postgres

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type VerificationTicketDB struct {
	*BaseDB[model.VerificationTicket]
}

func NewVerificationInfoDB(db *bun.DB) *VerificationTicketDB {
	type T = model.VerificationTicket

	return &VerificationTicketDB{
		BaseDB: NewBaseDB[T](db),
	}
}

func (v *VerificationTicketDB) FindByUserIds(ctx context.Context, phtgIds []uuid.UUID) ([]*model.VerificationTicket, error) {
	var verificationTicket []*model.VerificationTicket

	if err := v.db.NewSelect().Model(&verificationTicket).Where("user_id IN (?)", bun.In(phtgIds)).Scan(ctx, &verificationTicket); err != nil {
		return nil, err
	}

	return verificationTicket, nil
}
