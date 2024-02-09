package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (r *Resolver) ListUnverifiedPhotographers(c *gin.Context) {
	unvrfPhotographers, err := r.PhotographerUsecase.ListUnverifiedPhotographers(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error,
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   unvrfPhotographers,
	})
}
