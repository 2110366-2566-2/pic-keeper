package serve

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/config"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

func getOAuth2GoogleConf(clientId, clientSecret, redirectURL string) oauth2.Config {
	return oauth2.Config{
		ClientID:     clientId,
		ClientSecret: clientSecret,
		RedirectURL:  redirectURL,
		Scopes:       []string{"email", "profile"},
		Endpoint:     google.Endpoint,
	}
}

func retrieveSecretConf(appCfg *config.App) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Request = c.Request.WithContext(context.WithValue(c.Request.Context(), model.ContextKey("secretKey"), appCfg.SecretKey))
		c.Next()
	}
}

func setOAuth2GoogleConf(appCfg *config.App) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("OAuth2GoogleConf", getOAuth2GoogleConf(
			appCfg.OAuth2Google.ClientId,
			appCfg.OAuth2Google.ClientSecret,
			appCfg.OAuth2Google.RedirectURL,
		))
		c.Next()
	}
}
