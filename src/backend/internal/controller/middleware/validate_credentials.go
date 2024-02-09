package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func ValidateCredentials(c *gin.Context) {
	var secret string
	authorizationHeader := c.Request.Header.Get("Authorization")
	if authorizationHeader == "" {
		// If the Authorization header is not present, return a 403 status code
		c.JSON(http.StatusForbidden, gin.H{
			"status": "failed",
			"error":  "No Authorization header provided",
		})
		c.Abort()
		return
	}
	// Split the Authorization header to get the token
	extractedToken := strings.Split(authorizationHeader, "Bearer ")
	if len(extractedToken) == 2 {
		// Trim the token
		secret = strings.TrimSpace(extractedToken[1])
	} else {
		// If the token is not in the correct format, return a 400 status code
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "failed",
			"error":  "Incorrect Format of Authorization Token",
		})
		c.Abort()
		return
	}

	adminSecretKey, exist := c.Get("adminSecretKey")
	if !exist {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "failed",
			"message": "secret key not found",
		})
		c.Abort()
		return
	}

	if adminSecretKey.(string) != secret {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "failed",
			"message": "the provided credential is incorrect",
		})
		c.Abort()
		return
	}

	availablePhysicalIPs := c.GetStringSlice("AvailablePhysicalIPs")

	currentIP, exist := c.Get("CurrentPhysicalIP")
	if !exist {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "failed",
			"message": "current physical ips not found",
		})
		c.Abort()
		return
	}

	var parsedCurrentIP string
	var ok bool
	if parsedCurrentIP, ok = currentIP.(string); !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "failed",
			"message": "cannot parse current ip",
		})
		c.Abort()
		return
	}

	for _, avbIP := range availablePhysicalIPs {
		if avbIP == parsedCurrentIP {
			return
		}
	}
	c.JSON(http.StatusInternalServerError, gin.H{
		"status":  "failed",
		"message": "current device is not available to login as administrator",
	})
	c.Abort()
}
