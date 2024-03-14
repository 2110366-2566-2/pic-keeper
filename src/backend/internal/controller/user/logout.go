package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

// @Summary      Logout endpoint for users
// @Description Logout endpoint for users
// @Tags         users
// @Param Token header string true "Session token is required"
// @Accept       json
// @Produce      json
// @Success      200 {object} model.JSONSuccessResult{status=string,data=nil} "Logged out successfully"
// @Failure 404 {object} model.JSONErrorResult{status=string,error=nil} "User is no longer existed"
// @Failure 500 {object} model.JSONErrorResult{status=string,error=nil} "Unhandled internal server error"
// @Router /users/v1/logout [put]
func (r *Resolver) Logout(c *gin.Context) {
	user, exist := c.Get("user")
	if !exist {
		c.JSON(http.StatusNotFound, gin.H{
			"status": "failed",
			"error":  "the user is no longer existed",
		})
		c.Abort()
		return
	}

	userModel, ok := user.(model.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  "cannot do type assertion : please check the model of the user",
		})
		c.Abort()
		return
	}

	userModel.LoggedOut = true
	if err := r.UserUsecase.UserRepo.UpdateOne(c, &userModel); err != nil {
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
