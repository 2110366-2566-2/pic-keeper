package user

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (r *Resolver) GetUserInstance(c *gin.Context) {
	email, exist := c.Get("email")
	if !exist {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "this user no longer existed",
		})
		c.Abort()
		return
	}
	user, err := r.UserUsecase.UserRepo.FindOneByEmail(c, email.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		c.Abort()
		return
	}

	if user.LoggedOut {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "you have logged out, please log in again",
		})
		c.Abort()
		return
	}

	userJson, err := json.Marshal(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		c.Abort()
		return
	}

	c.Set("user", userJson)
	c.Next()
}
