package photographer

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/photographer/fieldvalidate"
	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) CreatePackage(c *gin.Context) {
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

	if !photographerObj.IsVerified {
		c.JSON(http.StatusForbidden, gin.H{
			"status": "failed",
			"error":  "You have not yet been verified, only verified photographers can create packages",
		})
		c.Abort()
		return
	}

	packageInput := model.GalleryInput{}
	if err := c.BindJSON(&packageInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"error":   err.Error(),
			"message": "unable to bind request body with json, please recheck",
		})
		c.Abort()
		return
	}

	if fieldErrs := fieldvalidate.CreatePackage(packageInput); len(fieldErrs) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "failed",
			"error":  util.JSONErrs(fieldErrs),
		})
		c.Abort()
		return
	}

	newPackage := model.Gallery{
		Id:             uuid.New(),
		Location:       *packageInput.Location,
		PhotographerId: photographerObj.Id,
		Name:           *packageInput.Name,
		Price:          *packageInput.Price,
	}

	if err := r.PackageUsecase.PackageRepo.AddOne(c, &newPackage); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status": "success",
		"data":   newPackage,
	})
}
