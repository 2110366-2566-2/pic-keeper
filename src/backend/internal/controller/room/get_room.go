package room

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/user"
	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) GetRoom(c *gin.Context) {
	user, ok := user.GetUser(c)
	if !ok {
		return
	}

	id := c.Param("id")
	uuid, err := uuid.Parse(id)
	if err != nil {
		util.Raise400Error(c, "UUID not provided or invalid")
		return
	}

	roomObj, err := r.RoomUsecase.RoomRepo.FindOneById(c, uuid)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	otherUsers, err := r.RoomUsecase.FindOtherUsersInRoom(c, user.Id, roomObj.Id)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	if err := r.GalleryUsecase.PopulateGalleryInRooms(c, roomObj); err != nil {
		util.Raise500Error(c, err)
		return
	}

	roomObj.OtherUsers = otherUsers

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   roomObj,
	})
}
