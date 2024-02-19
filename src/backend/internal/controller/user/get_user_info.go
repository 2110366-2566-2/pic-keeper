package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// @Summary      Get user information
// @Description  Get user information
// @Tags         users
// @Param Token header string true "Session token is required"
// @Param  userId path string true "The ID of the user you want to look up"
// @Accept       json
// @Produce      json
// @Success      200 {object} model.JSONSuccessResult{status=string,data=nil} "The user information will be returned in the data section"
// @Failure 400 {object} model.JSONErrorResult{status=string,error=nil} "Incorrect input"
// @Failure 404 {object} model.JSONErrorResult{status=string,error=nil} "The user does not exist"
// @Failure 500 {object} model.JSONErrorResult{status=string,error=nil} "Unhandled internal server error"
// @Router /users/v1/get-user/:id [get]
func (r *Resolver) GetUserInfo(c *gin.Context) {
	id := c.Param("id")
	uuid, err := uuid.Parse(id)
	if err != nil {
		c.JSON(400, gin.H{"status": "failed", "message": "UUID not provided or invalid"})
		c.Abort()
		return
	}

	// Use the extracted user ID to find the user
	userObj, err := r.UserUsecase.UserRepo.FindOneById(c, uuid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "message": "Failed to find user"})
		c.Abort()
		return
	}

	// Return the user's information in the response
	c.JSON(http.StatusOK, gin.H{
		"status":              "success",
		"data":                userObj,
		"profile_picture_url": GetProfilePictureUrl(userObj.ProfilePictureKey),
	})
}
