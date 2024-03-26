package admin

import (
	"github.com/Roongkun/software-eng-ii/internal/usecase"
	"github.com/uptrace/bun"
)

type Resolver struct {
	UserUsecase               usecase.UserUseCase
	BookingUsecase            usecase.BookingUseCase
	IssueUsecase              usecase.IssueUseCase
	VerificationTicketUsecase usecase.VerificationTicketUseCase
}

func NewResolver(db *bun.DB) *Resolver {
	return &Resolver{
		UserUsecase:               *usecase.NewUserUseCase(db),
		BookingUsecase:            *usecase.NewBookingUseCase(db),
		IssueUsecase:              *usecase.NewIssueUseCase(db),
		VerificationTicketUsecase: *usecase.NewVerificationTicketUseCase(db),
	}
}
