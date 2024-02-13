package admin

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) GetAdminInstance(c *gin.Context) {
	email, exist := c.Get("email")
	if !exist {
		c.JSON(http.StatusNotFound, gin.H{
			"status": "failed",
			"error":  "this administrator no longer existed",
		})
		c.Abort()
		return
	}

	admin, err := r.AdminUsecase.AdminRepo.FindOneByEmail(c, email.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	if admin.LoggedOut {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status": "failed",
			"error":  "you have logged out, please log in again",
		})
		c.Abort()
		return
	}

	c.Set("admin", getAdminInstance(admin))
	c.Next()
}

func getAdminInstance(admin *model.Administrator) model.Administrator {
	return *admin
}
