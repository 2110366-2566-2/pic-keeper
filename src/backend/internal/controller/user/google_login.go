package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) GoogleLogin(c *gin.Context) {
	config := util.GetGoogleLibConfig(c)

	url := config.AuthCodeURL("state")
	c.Redirect(http.StatusTemporaryRedirect, url)
	c.JSON(http.StatusOK, gin.H{
		"url": url,
	})
}
