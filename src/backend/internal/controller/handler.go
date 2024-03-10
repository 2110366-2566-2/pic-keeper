package controller

import (
	"github.com/Roongkun/software-eng-ii/internal/controller/admin"
	"github.com/Roongkun/software-eng-ii/internal/controller/photographer"
	"github.com/Roongkun/software-eng-ii/internal/controller/user"
	"github.com/uptrace/bun"
)

type Handler struct {
	User         user.Resolver
	Admin        admin.Resolver
	Photographer photographer.Resolver
}

func NewHandler(db *bun.DB) *Handler {
	return &Handler{
		User:         *user.NewResolver(db),
		Admin:        *admin.NewResolver(db),
		Photographer: *photographer.NewResolver(db),
	}
}
