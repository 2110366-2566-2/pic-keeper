package serve

import (
	"github.com/Roongkun/software-eng-ii/internal/config"
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
		c.Set("secretKey", appCfg.SecretKey)
		c.Next()
	}
}

func retrieveAdminSecretConf(appCfg *config.App) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("adminSecretKey", appCfg.AdministratorSecretKey)
		c.Next()
	}
}

func setAvailablePhysicalIPs(appCfg *config.App) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("AvailablePhysicalIPs", appCfg.AdministratorPhysicalIPs)
		c.Next()
	}
}

func setCurrentPhysicalIP(ip string) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("CurrentPhysicalIP", ip)
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
