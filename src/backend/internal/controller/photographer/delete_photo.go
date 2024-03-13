package photographer

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/third-party/s3utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) DeletePhoto(c *gin.Context) {
	photographer := c.MustGet("photographer")
	photographerObj, ok := photographer.(model.Photographer)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "failed",
			"error":  "could not bind json",
		})
		c.Abort()
		return
	}

	paramId := c.Param("id")
	galleryId := uuid.MustParse(paramId)

	paramId = c.Param("photoId")
	photoId := uuid.MustParse(paramId)

	gallery, err := r.GalleryUsecase.GalleryRepo.FindOneById(c, galleryId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	if gallery.PhotographerId != photographerObj.Id {
		c.JSON(http.StatusForbidden, gin.H{
			"status": "failed",
			"error":  "you have no permission to modify this gallery",
		})
		c.Abort()
		return
	}

	photo, err := r.PhotoUsecase.PhotoRepo.FindOneById(c, photoId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	bucket, err := s3utils.GetInstance()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "error": err.Error()})
		c.Abort()
		return
	}

	if err := bucket.DeleteFile(c, s3utils.GalleryPhotoBucket, photo.PhotoKey); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
	})
}
