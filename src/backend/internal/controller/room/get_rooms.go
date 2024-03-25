package room

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) GetRooms(c *gin.Context) {
	user := c.MustGet("user")
	userObj, ok := user.(model.User)
	if !ok {
		util.Raise400Error(c, "could not bind json")
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

		gallery, err := r.GalleryUsecase.GalleryRepo.FindOneById(c, existingRoom.GalleryId)
		if err != nil {
			util.Raise500Error(c, err)
			return
		}

		existingRoom.Gallery = *gallery

		photographer, err := r.UserUsecase.UserRepo.FindOneById(c, existingRoom.Gallery.PhotographerId)
		if err != nil {
			util.Raise500Error(c, err)
			return
		}
		existingRoom.Photographer = *photographer

		rooms = append(rooms, existingRoom)
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   rooms,
	})
}
