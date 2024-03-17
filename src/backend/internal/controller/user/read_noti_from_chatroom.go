package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) ReadNotificationFromRoom(c *gin.Context) {
	user := c.MustGet("user")
	userObj, ok := user.(model.User)
	if !ok {
		util.Raise400Error(c, "could not bind json")
		return
	}

	paramId := c.Param("roomId")
	roomId := uuid.MustParse(paramId)

	toBeUpdatedNoti, err := r.NotificationUsecase.NotificationRepo.GetAllUnreadByUserIdWithRoomOption(c, userObj.Id, roomId)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	if len(toBeUpdatedNoti) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"status": "success",
			"data":   nil,
		})
		c.Abort()
		return
	}

	for _, noti := range toBeUpdatedNoti {
		noti.Noticed = true
	}

	if err := r.NotificationUsecase.ReadNotificationFromThisRoom(c, toBeUpdatedNoti); err != nil {
		util.Raise500Error(c, err)
		return
	}

	if ok := PopulateConversation(toBeUpdatedNoti, c, r); !ok {
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   toBeUpdatedNoti,
	})
}
