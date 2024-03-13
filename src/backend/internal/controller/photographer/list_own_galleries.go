package photographer

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) ListOwnGalleries(c *gin.Context) {
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

	allGalleries, err := r.GalleryUsecase.FindByPhotographerId(c, photographerObj.Id)
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
		"data":   allGalleries,
	})
}
