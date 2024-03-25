package room

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
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
		gallery, err := r.GalleryUsecase.GalleryRepo.FindOneById(c, room.GalleryId)
		if err != nil {
			util.Raise500Error(c, err)
			return
		}
		room.Gallery = *gallery

		photographer, err := r.UserUsecase.UserRepo.FindOneById(c, room.Gallery.PhotographerId)
		if err != nil {
			util.Raise500Error(c, err)
			return
		}
		room.Photographer = *photographer
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"exist":  exist,
		"data":   room,
	})
}
