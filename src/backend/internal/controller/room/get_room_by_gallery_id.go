package room

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) GetRoomByGalleryId(c *gin.Context) {

	galleryId := c.Param("galleryId")
	uuid, err := uuid.Parse(galleryId)
	if err != nil {
		util.Raise400Error(c, "UUID not provided or invalid")
		return
	}

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

	room := model.Room{}
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
		if gallery.Id == uuid {
			room = *existingRoom
			break
		}

	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   room,
	})
}
