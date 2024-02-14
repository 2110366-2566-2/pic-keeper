package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

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
		"id":                  userObj.Id,
		"name":                userObj.Name,
		"email":               userObj.Email,
		"provider":            userObj.Provider,
		"logged_out":          userObj.LoggedOut,
		"profile_picture_url": GetProfilePictureUrl(userObj.ProfilePictureKey),
	})
}
