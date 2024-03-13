package photographer

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) DeletePackage(c *gin.Context) {
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

	paramId := c.Param("id")
	packageId := uuid.MustParse(paramId)

	existingPackage, err := r.PackageUsecase.PackageRepo.FindOneById(c, packageId)
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
			"error":  "You have no permission to delete this package",
		})
		c.Abort()
		return
	}

	deletedId, err := r.PackageUsecase.PackageRepo.DeleteOneById(c, packageId)
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
