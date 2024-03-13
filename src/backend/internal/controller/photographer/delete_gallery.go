package photographer

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) DeleteGallery(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		util.Raise400Error(c, "Failed to retrieve photographer from context")
		return
	}

	userObj, ok := user.(model.User)
	if !ok {
		util.Raise400Error(c, "Invalid object type in context")
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
	if userObj.Id != existingGallery.PhotographerId {
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
