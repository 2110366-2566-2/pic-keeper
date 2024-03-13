package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) SearchGalleries(c *gin.Context) {
	searchFilter := model.SearchFilter{}
	if err := c.BindQuery(&searchFilter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"error":   err.Error(),
			"message": "unable to bind request body with json, please recheck",
		})
		c.Abort()
		return
	}

	targetGalleries, err := r.GalleryUsecase.SearchWithFilter(c, &searchFilter)
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
		"data":   targetGalleries,
	})
}
