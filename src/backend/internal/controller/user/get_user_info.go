package user

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) GetUserInfo(c *gin.Context) {
	id := c.Param("id")
	uuid, err := uuid.Parse(id)
	if err != nil {
		c.JSON(400, gin.H{"error": "UUID not provided or invalid"})
		c.Abort()
		return
	}

	// Use the extracted user ID to find the user
	userObj, err := r.UserUsecase.UserRepo.FindOneById(c, uuid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find user"})
		c.Abort()
		return
	}

	// Construct the URL for the profile picture if it's available
	pictureURL := ""
	if userObj.ProfilePictureKey != nil {
		pictureURL = fmt.Sprintf("http://localhost:4566/%s/%s", "profile-picture", *userObj.ProfilePictureKey)
	}

	// Return the user's information in the response
	c.JSON(http.StatusOK, gin.H{
		"message":     "User information retrieved successfully",
		"id":          userObj.Id,
		"name":        userObj.Name,
		"email":       userObj.Email,
		"provider":    userObj.Provider,
		"logged_out":  userObj.LoggedOut,
		"picture_url": pictureURL,
	})
}
