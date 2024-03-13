package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) RequestVerification(c *gin.Context) {
	user := c.MustGet("user")
	userObj, ok := user.(model.User)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "failed",
			"error":  "could not bind JSON",
		})
		c.Abort()
		return
	}

	if userObj.VerificationStatus != model.PhotographerNotVerifiedStatus && userObj.VerificationStatus != model.PhotographerRejectedStatus {
		c.JSON(http.StatusForbidden, gin.H{
			"status": "failed",
			"error":  "cannot request further verification with your current status",
		})
		c.Abort()
		return
	}

	userObj.VerificationStatus = model.PhotographerPendingStatus
	if err := r.UserUsecase.UserRepo.UpdateOne(c, &userObj); err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   userObj,
	})
}
