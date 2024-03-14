package admin

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) Reject(c *gin.Context) {
	photographerId := c.Param("id")

	toBeRejected, err := r.UserUsecase.UserRepo.FindOneById(c, uuid.MustParse(photographerId))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error,
		})
		c.Abort()
		return
	}

	toBeRejected.VerificationStatus = model.PhotographerRejectedStatus
	if err = r.UserUsecase.UserRepo.UpdateOne(c, toBeRejected); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error,
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   toBeRejected,
	})
}
