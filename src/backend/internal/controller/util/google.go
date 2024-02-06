package util

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
)

func GetGoogleLibConfig(c *gin.Context) *oauth2.Config {
	googleConf, exist := c.Get("OAuth2GoogleConf")
	if !exist {
		c.JSON(http.StatusNotFound, ReturnErr("please check the `setOAuth2GoogleConf` middleware",
			errors.New("the oauth2 configuration for Google is not found")))
		c.Abort()
		return nil
	}

	config, ok := googleConf.(oauth2.Config)
	if !ok {
		c.JSON(http.StatusInternalServerError, ReturnErr("please check the model of the config",
			errors.New("cannot do type assertion")))
		c.Abort()
		return nil
	}

	return &config
}
