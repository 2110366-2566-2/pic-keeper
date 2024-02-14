package middleware

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/third-party/auth"
	"github.com/gin-gonic/gin"
)

func ValidateCredentials(c *gin.Context) {
	token, ok := util.ExtractToken(c)
	if !ok {
		c.JSON(c.GetInt("errorStatus"), gin.H{
			"status":  "failed",
			"message": c.GetString("errorMessage"),
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

	jwtWrapper := auth.JwtWrapper{
		SecretKey: adminSecretKey.(string),
		Issuer:    "AuthProvider",
	}

	claims, err := jwtWrapper.ValidateToken(token, true)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	c.Set("email", claims.Email)
	c.Next()
}
