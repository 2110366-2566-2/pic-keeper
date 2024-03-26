package repository

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
)

type VerificationTicket interface {
	BaseRepo[model.VerificationTicket]
	FindByUserIds(ctx context.Context, phtgIds []uuid.UUID) ([]*model.VerificationTicket, error)
}
