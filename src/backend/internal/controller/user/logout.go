package user

import (
	"encoding/json"
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) Logout(c *gin.Context) {
	userModel := model.User{}
	userJson, exist := c.Get("user")
	if !exist {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "the user is no longer existed",
		})
		c.Abort()
		return
	}
	userBytes, ok := userJson.([]byte)
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "internal error",
		})
		c.Abort()
		return
	}

	json.Unmarshal(userBytes, &userModel)

	userModel.LoggedOut = true
	if err := r.UserUsecase.UserRepo.UpdateOne(c, &userModel); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "you have logged out successfully",
	})
}
