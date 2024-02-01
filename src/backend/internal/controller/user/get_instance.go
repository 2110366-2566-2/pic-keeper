package user

import (
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

	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}
