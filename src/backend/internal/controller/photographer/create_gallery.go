package photographer

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/photographer/fieldvalidate"
	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) CreateGallery(c *gin.Context) {
	photographer, exists := c.Get("photographer")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "error": "Failed to retrieve photographer from context"})
		c.Abort()
		return
	}

	photographerObj, ok := photographer.(model.Photographer)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "error": "Invalid object type in context"})
		c.Abort()
		return
	}

	if photographerObj.VerificationStatus != model.PhotographerVerifiedStatus {
		c.JSON(http.StatusForbidden, gin.H{
			"status": "failed",
			"error":  "You have not yet been verified, only verified photographers can create galleries",
		})
		c.Abort()
		return
	}

	galleryInput := model.GalleryInput{}
	if err := c.BindJSON(&galleryInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"error":   err.Error(),
			"message": "unable to bind request body with json, please recheck",
		})
		c.Abort()
		return
	}

	if fieldErrs := fieldvalidate.CreateGallery(galleryInput); len(fieldErrs) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "failed",
			"error":  util.JSONErrs(fieldErrs),
		})
		c.Abort()
		return
	}

	newGallery := model.Gallery{
		Id:             uuid.New(),
		Location:       *galleryInput.Location,
		PhotographerId: photographerObj.Id,
		Name:           *galleryInput.Name,
		Price:          *galleryInput.Price,
	}

	if err := r.GalleryUsecase.GalleryRepo.AddOne(c, &newGallery); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status": "success",
		"data":   newGallery,
	})
}
