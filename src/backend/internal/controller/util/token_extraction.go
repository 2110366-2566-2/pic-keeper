package util

import (
	"net/http"
	"strings"

	"github.com/Roongkun/software-eng-ii/internal/third-party/databases"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

func ExtractToken(c *gin.Context) (token string, ok bool) {
	authorizationCookie, err := c.Cookie("token")
	if err != nil || authorizationCookie == "" {
		c.Set("errorStatus", http.StatusForbidden)
		c.Set("errorMessage", "No Authorization header provided")
		return "", false
	}

	// Split the Authorization header to get the token
	extractedToken := strings.Split(authorizationCookie, "Bearer ")
	if len(extractedToken) == 2 {
		// Trim the token
		token = strings.TrimSpace(extractedToken[1])
	} else {
		// If the token is not in the correct format, return a 400 status code
		c.Set("errorStatus", http.StatusBadRequest)
		c.Set("errorMessage", "Incorrect Format of Authorization Token")
		return "", false
	}

	return token, true
}

func LookupTokenInRedis(c *gin.Context) (token string, ok bool) {
	token, ok = ExtractToken(c)
	if !ok {
		return "", false
	}
	email, err := databases.RedisClient.Get(c, token).Result()
	if err == redis.Nil {
		c.Set("errorStatus", http.StatusNotFound)
		c.Set("errorMessage", "please do re-login")
		return "", false
	}
	if err != nil {
		c.Set("errorStatus", http.StatusInternalServerError)
		c.Set("errorMessage", err.Error())
		return "", false
	}

	return email, true
}
