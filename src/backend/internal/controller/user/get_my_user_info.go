package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

// @Summary      Get my user information
// @Description  Get my user information
// @Tags         users
// @Param Token header string true "Session token is required"
// @Accept       json
// @Produce      json
// @Success      200 {object} model.JSONSuccessResult{status=string,data=nil} "The user information will be returned in the data section"
// @Failure 400 {object} model.JSONErrorResult{status=string,error=nil} "Incorrect input"
// @Failure 500 {object} model.JSONErrorResult{status=string,error=nil} "Unhandled internal server error"
// @Router /users/v1/get-my-user-info [get]
func (r *Resolver) GetMyUserInfo(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "message": "Failed to retrieve user from context"})
		c.Abort()
		return
	}
	userObj, ok := user.(model.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "message": "Invalid user type in context"})
		c.Abort()
		return
	}

	// Return the URL in the response
	c.JSON(http.StatusOK, gin.H{
		"status":              "success",
		"data":                userObj,
		"profile_picture_url": util.GetProfilePictureUrl(userObj.ProfilePictureKey),
	})

}
