package user

import (
	"fmt"
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) GetUserInfo(c *gin.Context) {
	UserIdInput := model.UserIdInput{}
	// Parse JSON body to extract user ID
	if err := c.BindJSON(&UserIdInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse request body"})
		return
	}

	// Use the extracted user ID to find the user
	userObj, err := r.UserUsecase.UserRepo.FindOneById(c, UserIdInput.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find user"})
		return
	}

	// Construct the URL for the profile picture if it's available
	pictureURL := ""
	if userObj.ProfilePicture != nil {
		pictureURL = fmt.Sprintf("http://localhost:4566/%s/%s", "profile-picture", *userObj.ProfilePicture)
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
