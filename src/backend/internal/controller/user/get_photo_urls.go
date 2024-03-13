package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) GetPhotoUrlsInGallery(c *gin.Context) {
	paramId := c.Param("id")
	galleryId := uuid.MustParse(paramId)

	urls, err := r.PhotoUsecase.FindUrlsByGalleryId(c, galleryId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   urls,
	})
}
