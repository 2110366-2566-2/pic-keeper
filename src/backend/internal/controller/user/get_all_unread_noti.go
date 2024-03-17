package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) GetAllUnreadNotifications(c *gin.Context) {
	userObj, ok := getUser(c)
	if !ok {
		return
	}

	unreadNotis, err := r.NotificationUsecase.GetAllUnreadByUserIdWithRoomOption(c, userObj.Id)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   unreadNotis,
	})
}

func (r *Resolver) GetAllUnreadNotificationsFromRoom(c *gin.Context) {
	userObj, ok := getUser(c)
	if !ok {
		return
	}
	paramId := c.Param("roomId")
	roomId := uuid.MustParse(paramId)

	unreadNotis, err := r.NotificationUsecase.GetAllUnreadByUserIdWithRoomOption(c, userObj.Id, roomId)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   unreadNotis,
	})

}

func getUser(c *gin.Context) (*model.User, bool) {
	user := c.MustGet("user")
	userObj, ok := user.(model.User)
	if !ok {
		util.Raise400Error(c, "could not bind json")
		return nil, false
	}

	return &userObj, true
}
