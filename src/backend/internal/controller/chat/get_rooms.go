package chat

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) GetRooms(c *gin.Context) {
	userId := c.Param("id")
	uuid := uuid.MustParse(userId)

}
