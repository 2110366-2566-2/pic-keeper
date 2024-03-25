package photographer

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) ListOwnGalleries(c *gin.Context) {
	photographer, ok := getPhotographer(c)
	if !ok {
		return
	}

	allGalleries, err := r.GalleryUsecase.FindByPhotographerId(c, photographer.Id)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   allGalleries,
	})
}
