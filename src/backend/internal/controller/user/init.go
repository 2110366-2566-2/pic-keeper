package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *handler) Init(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "hello world",
	})
}
