package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/third-party/auth"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) RefreshToken(c *gin.Context) {
	userEmail, ok := util.LookupTokenInRedis(c)
	if !ok {
		c.JSON(c.GetInt("errorStatus"), gin.H{
			"status":  "failed",
			"message": c.GetString("errorMessage"),
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
		"refreshed_session_token": token,
	})
}
