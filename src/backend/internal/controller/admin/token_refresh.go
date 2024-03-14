package admin

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/third-party/auth"
	"github.com/gin-gonic/gin"
)

// Refresh session token for administrators
//
//	@Summary      Refresh session token for administrators
//	@Description  Refresh session token for administrators
//	@Tags         admin
//	@Param ExpiredToken header string true "Expired token is required"
//	@Accept       json
//	@Produce      json
//	@Success      200 {object} model.JSONSuccessResult{status=string,data=nil} "The refreshed session token will be returned inside the data field"
//	@Failure 400 {object} model.JSONErrorResult{status=string,error=nil} "Incorrect input"
//	@Failure 403 {object} model.JSONErrorResult{status=string,error=nil} "No Authorization header provided"
//	@Failure 404 {object} model.JSONErrorResult{status=string,error=nil} "Re-login is needed or the administrator may no longer exist"
//	@Failure 500 {object} model.JSONErrorResult{status=string,error=nil} "Unhandled internal server error"
//
//	@Router       /admin/v1/refresh [get]
func (r *Resolver) RefreshToken(c *gin.Context) {
	adminEmail, ok := util.LookupTokenInRedis(c)
	if !ok {
		c.JSON(c.GetInt("errorStatus"), gin.H{
			"status": "failed",
			"error":  c.GetString("errorMessage"),
		})
		c.Abort()
		return
	}

	exist, err := r.AdminUsecase.CheckExistenceByEmail(c, adminEmail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	if !exist {
		c.JSON(http.StatusNotFound, gin.H{
			"status": "failed",
			"error":  "the admin is no longer existed",
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

	token, err := jwtWrapper.GenerateToken(c, adminEmail, true)
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
