package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

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
		"id":                  userObj.Id,
		"name":                userObj.Name,
		"email":               userObj.Email,
		"provider":            userObj.Provider,
		"logged_out":          userObj.LoggedOut,
		"profile_picture_url": GetProfilePictureUrl(userObj.ProfilePictureKey),
	})

}
