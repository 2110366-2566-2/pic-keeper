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
	file, _, err := c.Request.FormFile("picture")
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

	user := c.MustGet("user")
	userObj, ok := user.(model.User)
	if !ok {
		util.Raise400Error(c, "could not bind JSON")
		return
	}

	paramId := c.Param("id")
	galleryId := uuid.MustParse(paramId)

	existingGallery, err := r.GalleryUsecase.GalleryRepo.FindOneById(c, galleryId)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	if existingGallery.PhotographerId != userObj.Id {
		util.Raise403Error(c, "you have no permission to upload photos to this gallery")
		return
	}

	fileUUID := uuid.New().String()
	objectKey := fmt.Sprintf("%s-%s", userObj.Id.String(), fileUUID)

	bucket, err := s3utils.GetInstance()
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	if err := bucket.UploadFile(c.Request.Context(), s3utils.GalleryPhotoBucket, objectKey, buf, contentType); err != nil {
		util.Raise500Error(c, err)
		return
	}

	newPhoto := &model.Photo{
		Id:        uuid.New(),
		GalleryId: galleryId,
		PhotoKey:  objectKey,
	}

	if err := r.PhotoUsecase.PhotoRepo.AddOne(c, newPhoto); err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   newPhoto,
	})
}
