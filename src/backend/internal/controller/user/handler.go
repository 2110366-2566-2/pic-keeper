package user

import (
	"github.com/Roongkun/software-eng-ii/internal/usecase"
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

type handler struct {
	UserUseCase usecase.UserUseCase
}

func Register(r *gin.Engine, db *bun.DB) {
	h := &handler{
		UserUseCase: *usecase.NewUserUseCase(db),
	}

	r.GET("/init", h.Init)
}
