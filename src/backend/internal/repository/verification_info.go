package repository

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/google/uuid"
)

type VerificationInfo interface {
	BaseRepo[model.VerificationInformation]
	FindByUserIds(ctx context.Context, phtgIds []uuid.UUID) ([]*model.VerificationInformation, error)
}
