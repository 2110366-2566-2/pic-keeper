package util

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/third-party/databases"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

func ExtractToken(c *gin.Context) (string, bool) {
	authorizationCookie, err := c.Cookie("token")
	if err != nil || authorizationCookie == "" {
		c.Set("errorStatus", http.StatusForbidden)
		c.Set("errorMessage", "No Authorization header provided")
		return "", false
	}

	return authorizationCookie, true
}

func LookupTokenInRedis(c *gin.Context) (token string, ok bool) {
	token, ok = ExtractToken(c)
	if !ok {
		return "", false
	}
	email, err := databases.RedisClient.Get(c, token).Result()
	if err == redis.Nil {
		c.Set("errorStatus", http.StatusUnauthorized)
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
