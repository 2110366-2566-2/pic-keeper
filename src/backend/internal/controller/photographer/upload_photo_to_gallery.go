package photographer

import (
	"fmt"
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/third-party/s3utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) UploadPhotoToGallery(c *gin.Context) {
	file, _, err := c.Request.FormFile("profilePicture")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "failed", "error": "Could not retrieve the file"})
		c.Abort()
		return
	}
	defer file.Close()

	buf, contentType, err := util.FormatImage(file)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "failed", "error": "Could not retrieve the file"})
		c.Abort()
		return
	}

	photographer := c.MustGet("photographer")
	photographerObj, ok := photographer.(model.Photographer)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "failed",
			"error":  "could not bind json object",
		})
		c.Abort()
		return
	}

	paramId := c.Param("id")
	galleryId := uuid.MustParse(paramId)

	existingGallery, err := r.GalleryUsecase.GalleryRepo.FindOneById(c, galleryId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	if existingGallery.PhotographerId != photographerObj.Id {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "failed",
			"error":  "you have no permission to upload photos to this gallery",
		})
		c.Abort()
		return
	}

	fileUUID := uuid.New().String()
	objectKey := fmt.Sprintf("%s-%s", photographerObj.Id.String(), fileUUID)

	bucket, err := s3utils.GetInstance()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "error": err.Error()})
		c.Abort()
		return
	}

	if err := bucket.UploadFile(c.Request.Context(), s3utils.GalleryPhotoBucket, objectKey, buf, contentType); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "error": "Failed to upload the file"})
		c.Abort()
		return
	}

	newPhoto := &model.Photo{
		Id:        uuid.New(),
		GalleryId: galleryId,
		PhotoKey:  objectKey,
	}

	if err := r.PhotoUsecase.PhotoRepo.AddOne(c, newPhoto); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "error": "Failed to upload the file"})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   newPhoto,
	})
}
