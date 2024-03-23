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
	user, exists := c.Get("user")
	if !exists {
		util.Raise400Error(c, "Failed to retrieve photographer from context")
		return
	}

	userObj, ok := user.(model.User)
	if !ok {
		util.Raise400Error(c, "Failed to retrieve photographer from context")
		return
	}

	// double-check here
	if userObj.VerificationStatus != model.PhotographerVerifiedStatus {
		c.JSON(http.StatusForbidden, gin.H{
			"status": "failed",
			"error":  "You have not yet been verified, only verified photographers can create galleries",
		})
		c.Abort()
		return
	}

	galleryInput := model.GalleryInput{}
	if err := c.BindJSON(&galleryInput); err != nil {
		util.Raise400Error(c, err.Error())
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
		PhotographerId: userObj.Id,
		Name:           *galleryInput.Name,
		Price:          *galleryInput.Price,
		Hours:          *galleryInput.Hours,
		Description:    galleryInput.Description,
		DeliveryTime:   *galleryInput.DeliveryTime,
		Included:       galleryInput.Included,
	}

	if err := r.GalleryUsecase.GalleryRepo.AddOne(c, &newGallery); err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status": "success",
		"data":   newGallery,
	})
}
