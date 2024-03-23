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
	photographer, ok := getPhotographer(c)
	if !ok {
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
	if photographer.Id != existingGallery.PhotographerId {
		util.Raise403Error(c, "You have no permission to edit this gallery")
		return
	}

	// editing
	updateGallery(existingGallery, updatingGalleryInput)

	if err := r.GalleryUsecase.GalleryRepo.UpdateOne(c, existingGallery); err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   existingGallery,
	})
}

func updateGallery(gallery *model.Gallery, input model.GalleryInput) {
	if input.Name != nil {
		gallery.Name = *input.Name
	}
	if input.Price != nil {
		gallery.Price = *input.Price
	}
	if input.Location != nil {
		gallery.Location = *input.Location
	}
	if input.Hours != nil {
		gallery.Hours = *input.Hours
	}
	if input.Description != nil {
		gallery.Description = input.Description
	}
	if input.DeliveryTime != nil {
		gallery.DeliveryTime = *input.DeliveryTime
	}
	if input.Included != nil {
		gallery.Included = input.Included
	}
}
