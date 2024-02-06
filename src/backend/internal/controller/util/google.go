package util

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
)

func GetGoogleLibConfig(c *gin.Context) *oauth2.Config {
	googleConf, exist := c.Get("OAuth2GoogleConf")
	if !exist {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "please check the `setOAuth2GoogleConf` middleware",
			"error":   "the oauth2 configuration for Google is not found",
		})
		c.Abort()
		return nil
	}

	config, ok := googleConf.(oauth2.Config)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "please check the model of the config",
			"error":   "cannot do type assertion",
		})
		c.Abort()
		return nil
	}

	return &config
}
