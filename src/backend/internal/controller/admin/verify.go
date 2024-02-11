package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) Verify(c *gin.Context) {
	photographerId := c.Param("id")

	toBeVrf, err := r.PhotographerUsecase.PhotographerRepo.FindOneById(c, uuid.MustParse(photographerId))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error,
		})
		c.Abort()
		return
	}

	toBeVrf.IsVerified = true
	if err = r.PhotographerUsecase.PhotographerRepo.UpdateOne(c, toBeVrf); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error,
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   toBeVrf,
	})
}
