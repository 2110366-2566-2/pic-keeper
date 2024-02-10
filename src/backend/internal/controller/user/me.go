package user

import (
	"fmt"
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) Me(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user from context"})
		return
	}
	userObj, ok := user.(model.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user type in context"})
		return
	}

	// Construct the URL for the profile picture
	pictureURL := ""
	if userObj.ProfilePicture != nil {
		pictureURL = fmt.Sprintf("http://localhost:4566/%s/%s", "profile-picture", *userObj.ProfilePicture)
	}

	// Return the URL in the response
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
