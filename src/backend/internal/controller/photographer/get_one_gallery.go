package photographer

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) GetOnePackage(c *gin.Context) {
	paramId := c.Param("id")
	galleryId := uuid.MustParse(paramId)
	gallery, err := r.GalleryUsecase.GalleryRepo.FindOneById(c, galleryId)
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
		"data":   gallery,
	})
}
