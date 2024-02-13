package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) GetUserInstance(c *gin.Context) {
	email, exist := c.Get("email")
	if !exist {
		c.JSON(http.StatusNotFound, gin.H{
			"status": "failed",
			"error":  "this user no longer existed",
		})
		c.Abort()
		return
	}

	user, err := r.UserUsecase.UserRepo.FindOneByEmail(c, email.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	if user.LoggedOut {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status": "failed",
			"error":  "you have logged out, please log in again",
		})
		c.Abort()
		return
	}

	c.Set("user", getUserInstance(user))
	c.Next()
}

func getUserInstance(user *model.User) model.User {
	return *user
}
