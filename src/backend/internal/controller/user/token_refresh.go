package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/third-party/auth"
	"github.com/Roongkun/software-eng-ii/internal/third-party/databases"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

func (r *Resolver) RefreshToken(c *gin.Context) {
	userEmail, err := databases.RedisClient.Get(c, util.ExtractToken(c)).Result()
	if err == redis.Nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status":  "failed",
			"message": "the given session token has never been created",
		})
		c.Abort()
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "failed",
			"message": err.Error(),
		})
		c.Abort()
		return
	}

	exist, err := r.UserUsecase.CheckExistenceByEmail(c, userEmail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "failed",
			"message": err.Error(),
		})
		c.Abort()
		return
	}

	if !exist {
		c.JSON(http.StatusNotFound, gin.H{
			"status":  "failed",
			"message": "the user is no longer existed",
		})
		c.Abort()
		return
	}

	secretKey := c.GetString("secretKey")

	jwtWrapper := auth.JwtWrapper{
		SecretKey:         secretKey,
		Issuer:            "AuthProvider",
		ExpirationMinutes: 5,
		ExpirationHours:   12,
	}

	token, err := jwtWrapper.GenerateToken(c, userEmail, false)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":                  "success",
		"refreshed-session-token": token,
	})
}
