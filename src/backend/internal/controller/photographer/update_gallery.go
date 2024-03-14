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

	updatingGalleryInput := model.GalleryInput{}
	if err := c.BindJSON(&updatingGalleryInput); err != nil {
		util.Raise400Error(c, "unable to bind request body with json model, please recheck")
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
		util.Raise500Error(c, err)
		return
	}

	// dbValidate
	if userObj.Id != existingGallery.PhotographerId {
		util.Raise403Error(c, "You have no permission to edit this gallery")
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
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   existingGallery,
	})
}
