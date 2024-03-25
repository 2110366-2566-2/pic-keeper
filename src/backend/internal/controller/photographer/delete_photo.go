package photographer

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/third-party/s3utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) DeletePhoto(c *gin.Context) {
	photographer, ok := getPhotographer(c)
	if !ok {
		return
	}

	paramId := c.Param("id")
	galleryId := uuid.MustParse(paramId)

	paramId = c.Param("photoId")
	photoId := uuid.MustParse(paramId)

	gallery, err := r.GalleryUsecase.GalleryRepo.FindOneById(c, galleryId)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	if gallery.PhotographerId != photographer.Id {
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
		util.Raise500Error(c, err)
		return
	}

	deletedId, err := r.PhotoUsecase.PhotoRepo.DeleteOneById(c, photoId)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   deletedId,
	})
}
