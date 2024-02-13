package admin

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/third-party/auth"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) RefreshToken(c *gin.Context) {
	adminEmail := util.LookupTokenInRedis(c)

	exist, err := r.AdminUsecase.CheckExistenceByEmail(c, adminEmail)
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

	secretKey := c.GetString("adminSecretKey")
	jwtWrapper := auth.JwtWrapper{
		SecretKey:         secretKey,
		Issuer:            "AuthProvider",
		ExpirationMinutes: 5,
		ExpirationHours:   12,
	}

	token, err := jwtWrapper.GenerateToken(c, adminEmail, false)
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
