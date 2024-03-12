package room

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) GetAllConversations(c *gin.Context) {
	user := c.MustGet("user")
	userObj, ok := user.(model.User)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "failed",
			"error":  "could not bind json",
		})
		c.Abort()
		return
	}

	paramId := c.Param("id")
	roomId := uuid.MustParse(paramId)

	isMember, err := r.LookupUsecase.CheckRoomMembership(c, userObj.Id, roomId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	if !isMember {
		c.JSON(http.StatusForbidden, gin.H{
			"status": "failed",
			"error":  "you have no permission to read messages in this room",
		})
		c.Abort()
		return
	}

	conversations, err := r.ConversationUsecase.ListByRoomId(c, roomId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   conversations,
	})
}
