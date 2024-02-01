package user

import (
	"context"
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

func (h *handler) Init(c *gin.Context) {
	// c.JSON(http.StatusOK, gin.H{
	// 	"message": "hello world",
	// })

	str := "33"
	model := model.User{
		Name:     "test",
		Email:    "test@mail.com",
		Password: &str,
	}

	if err := h.UserUseCase.UserRepo.AddOne(context.Background(), &model); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, model)
}
