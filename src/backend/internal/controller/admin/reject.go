package admin

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) Reject(c *gin.Context) {
	admin := c.MustGet("user")
	adminObj, ok := admin.(model.User)
	if !ok {
		util.Raise400Error(c, "could not bind json")
		return
	}

	if !adminObj.IsAdmin {
		util.Raise403Error(c, "only administrators are allowed to reject or verifiy photographers")
		return
	}

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
