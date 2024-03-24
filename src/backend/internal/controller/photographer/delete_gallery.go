package photographer

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) DeleteGallery(c *gin.Context) {
	photographer, ok := getPhotographer(c)
	if !ok {
		return
	}

	paramId := c.Param("id")
	galleryId := uuid.MustParse(paramId)

	existingGallery, err := r.GalleryUsecase.GalleryRepo.FindOneById(c, galleryId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	// dbValidate
	if photographer.Id != existingGallery.PhotographerId {
		c.JSON(http.StatusForbidden, gin.H{
			"status": "failed",
			"error":  "You have no permission to delete this gallery",
		})
		c.Abort()
		return
	}

	deletedId, err := r.GalleryUsecase.GalleryRepo.DeleteOneById(c, galleryId)
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
		"data":   deletedId,
	})
}
