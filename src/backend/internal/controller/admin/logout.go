package admin

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) Logout(c *gin.Context) {
	admin, exist := c.Get("admin")
	if !exist {
		c.JSON(http.StatusNotFound, gin.H{
			"status": "failed",
			"error":  "the user is no longer existed",
		})
		c.Abort()
		return
	}

	adminModel, ok := admin.(model.Administrator)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "please check the model of the administrator",
			"error":   "cannot do type assertion",
		})
		c.Abort()
		return
	}

	adminModel.LoggedOut = true
	if err := r.AdminUsecase.AdminRepo.UpdateOne(c, &adminModel); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "you have logged out successfully",
	})
}
