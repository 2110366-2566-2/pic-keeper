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
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "failed",
			"error":  "could not bind json",
		})
		c.Abort()
		return
	}

	roomLookups, err := r.LookupUsecase.FindByUserId(c, userObj.Id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
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

		rooms = append(rooms, existingRoom)
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   rooms,
	})
}
