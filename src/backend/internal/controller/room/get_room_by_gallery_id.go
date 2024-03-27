package room

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/user"
	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) GetRoomOfUserByGalleryId(c *gin.Context) {
	paramId := c.Param("galleryId")
	galleryId, err := uuid.Parse(paramId)
	if err != nil {
		util.Raise400Error(c, "UUID not provided or invalid")
		return
	}

	userObj, ok := user.GetUser(c)
	if !ok {
		return
	}

	roomLookups, err := r.LookupUsecase.FindByUserId(c, userObj.Id)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	roomIdsBelongToUser := []uuid.UUID{}
	for _, roomLookup := range roomLookups {
		roomIdsBelongToUser = append(roomIdsBelongToUser, roomLookup.RoomId)
	}

	exist, room, err := r.RoomUsecase.FindRoomOfUserByGalleryId(c, roomIdsBelongToUser, galleryId)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	if exist {
		otherUsers, err := r.RoomUsecase.FindOtherUsersInRoom(c, userObj.Id, room.Id)
		if err != nil {
			util.Raise500Error(c, err)
			return
		}

		if err := r.GalleryUsecase.PopulateGalleryInRooms(c, room); err != nil {
			util.Raise500Error(c, err)
			return
		}

		room.OtherUsers = otherUsers
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"exist":  exist,
		"data":   room,
	})
}
