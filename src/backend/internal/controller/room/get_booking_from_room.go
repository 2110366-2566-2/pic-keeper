package room

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/user"
	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) GetBookingFromRoom(c *gin.Context) {
	userObj, ok := user.GetUser(c)
	if !ok {
		return
	}

	paramId := c.Param("id")
	roomId := uuid.MustParse(paramId)

	isMember, err := r.LookupUsecase.CheckRoomMembership(c, userObj.Id, roomId)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	if !isMember {
		util.Raise403Error(c, "you have no permission to get the booking of this room")
		return
	}

	booking, err := r.BookingUsecase.FindByRoomId(c, r.RoomUsecase, r.GalleryUsecase, roomId)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   booking,
	})
}
