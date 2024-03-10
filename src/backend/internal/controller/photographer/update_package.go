package photographer

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/photographer/fieldvalidate"
	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) UpdatePackage(c *gin.Context) {
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

	updatingPackageInput := model.PackageInput{}
	if err := c.BindJSON(&updatingPackageInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"error":   err.Error(),
			"message": "unable to bind request body with json model, please recheck",
		})
		c.Abort()
		return
	}

	if fieldErrs := fieldvalidate.UpdatePackage(updatingPackageInput); len(fieldErrs) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "failed",
			"error":  util.JSONErrs(fieldErrs),
		})
		c.Abort()
		return
	}

	existingPackage, err := r.PackageUsecase.PackageRepo.FindOneById(c, *updatingPackageInput.Id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	// dbValidate
	if photographerObj.Id != existingPackage.PhotographerId {
		c.JSON(http.StatusForbidden, gin.H{
			"status": "failed",
			"error":  "You have no permission to edit this package",
		})
		c.Abort()
		return
	}

	// editing
	if updatingPackageInput.Name != nil {
		existingPackage.Name = *updatingPackageInput.Name
	}
	if updatingPackageInput.Price != nil {
		existingPackage.Price = *updatingPackageInput.Price
	}

	if err := r.PackageUsecase.PackageRepo.UpdateOne(c, existingPackage); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   existingPackage,
	})
}
