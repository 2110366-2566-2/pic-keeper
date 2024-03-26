package room

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/user"
	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/usecase"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) GetRooms(c *gin.Context) {
	userObj, ok := user.GetUser(c)
	if !ok {
		return
	}

	roomLookups, err := r.LookupUsecase.FindByUserId(c, userObj.Id)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	rooms := []*model.Room{}
	for _, roomLookup := range roomLookups {
		existingRoom, err := r.RoomUsecase.RoomRepo.FindOneById(c, roomLookup.RoomId)
		if err != nil {
			util.Raise500Error(c, err)
			return
		}

		otherUsers, err := r.RoomUsecase.FindOtherUsersInRoom(c, userObj.Id, roomLookup.RoomId)
		if err != nil {
			util.Raise500Error(c, err)
			return
		}

		existingRoom.OtherUsers = otherUsers

		rooms = append(rooms, existingRoom)
	}

	if err := usecase.PopulateGalleryInRooms(c, r.GalleryUsecase, rooms...); err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   rooms,
	})
}
