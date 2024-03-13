package photographer

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/photographer/fieldvalidate"
	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) UpdateGallery(c *gin.Context) {
	photographer, exists := c.Get("photographer")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  "Failed to retrieve photographer from context",
		})
		c.Abort()
		return
	}

	photographerObj, ok := photographer.(model.Photographer)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  "Invalid object type in context",
		})
		c.Abort()
		return
	}

	updatingGalleryInput := model.GalleryInput{}
	if err := c.BindJSON(&updatingGalleryInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"error":   err.Error(),
			"message": "unable to bind request body with json model, please recheck",
		})
		c.Abort()
		return
	}

	if fieldErrs := fieldvalidate.UpdateGallery(updatingGalleryInput); len(fieldErrs) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "failed",
			"error":  util.JSONErrs(fieldErrs),
		})
		c.Abort()
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
	if photographerObj.Id != existingGallery.PhotographerId {
		c.JSON(http.StatusForbidden, gin.H{
			"status": "failed",
			"error":  "You have no permission to edit this gallery",
		})
		c.Abort()
		return
	}

	// editing
	if updatingGalleryInput.Name != nil {
		existingGallery.Name = *updatingGalleryInput.Name
	}
	if updatingGalleryInput.Price != nil {
		existingGallery.Price = *updatingGalleryInput.Price
	}
	if updatingGalleryInput.Location != nil {
		existingGallery.Location = *updatingGalleryInput.Location
	}

	if err := r.GalleryUsecase.GalleryRepo.UpdateOne(c, existingGallery); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   existingGallery,
	})
}
