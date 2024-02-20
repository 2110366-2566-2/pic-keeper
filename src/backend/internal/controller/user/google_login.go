package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/gin-gonic/gin"
)

// @Summary      User login via Google OAuth2
// @Description  User login via Google OAuth2
// @Tags         google
// @Accept       json
// @Produce      json
// @Success      200 {object} model.JSONSuccessResult{status=string,data=nil} "The URL to the Google OAuth2 will be returned in the data field"
// @Failure 500 {object} model.JSONErrorResult{status=string,error=nil} "Unhandled internal server error"
//
// @Router       /authen/v1/google/login [post]
func (r *Resolver) GoogleLogin(c *gin.Context) {
	config := util.GetGoogleLibConfig(c)

	url := config.AuthCodeURL("state")
	c.Redirect(http.StatusTemporaryRedirect, url)
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"url":    url,
	})
}
