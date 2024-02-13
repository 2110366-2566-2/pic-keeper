package util

import (
	"net/http"
	"strings"

	"github.com/Roongkun/software-eng-ii/internal/third-party/databases"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

func ExtractToken(c *gin.Context) string {
	var token string
	authorizationHeader := c.Request.Header.Get("Authorization")
	if authorizationHeader == "" {
		// If the Authorization header is not present, return a 403 status code
		c.JSON(http.StatusForbidden, gin.H{
			"status": "failed",
			"error":  "No Authorization header provided",
		})
		c.Abort()
		return ""
	}

	// Split the Authorization header to get the token
	extractedToken := strings.Split(authorizationHeader, "Bearer ")
	if len(extractedToken) == 2 {
		// Trim the token
		token = strings.TrimSpace(extractedToken[1])
	} else {
		// If the token is not in the correct format, return a 400 status code
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "failed",
			"error":  "Incorrect Format of Authorization Token",
		})
		c.Abort()
		return ""
	}

	return token
}

func LookupTokenInRedis(c *gin.Context) string {
	email, err := databases.RedisClient.Get(c, ExtractToken(c)).Result()
	if err == redis.Nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status":  "failed",
			"message": "the given session token has never been created",
		})
		c.Abort()
		return ""
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "failed",
			"message": err.Error(),
		})
		c.Abort()
		return ""
	}

	return email
}
