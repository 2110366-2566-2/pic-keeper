package room

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) GetRoom(c *gin.Context) {
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

	gallery, err := r.GalleryUsecase.GalleryRepo.FindOneById(c, roomObj.GalleryId)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}
	roomObj.Gallery = *gallery

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   roomObj,
	})

}
