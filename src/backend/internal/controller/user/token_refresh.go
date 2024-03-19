package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/third-party/auth"
	"github.com/gin-gonic/gin"
)

// @Summary      Refresh session token for users
// @Description  Refresh session token for users
// @Tags         authen
// @Param ExpiredToken header string true "Expired token is required"
// @Accept       json
// @Produce      json
// @Success      200 {object} model.JSONSuccessResult{status=string,data=nil} "The refreshed session token will be returned inside the data field"
// @Failure 400 {object} model.JSONErrorResult{status=string,error=nil} "Incorrect input"
// @Failure 403 {object} model.JSONErrorResult{status=string,error=nil} "No Authorization header provided"
// @Failure 404 {object} model.JSONErrorResult{status=string,error=nil} "Re-login is needed or the user may no longer exist"
// @Failure 500 {object} model.JSONErrorResult{status=string,error=nil} "Unhandled internal server error"
//
// @Router       /authen/v1/refresh [get]
func (r *Resolver) RefreshToken(c *gin.Context) {
	userEmail, ok := util.LookupTokenInRedis(c)
	if !ok {
		c.JSON(c.GetInt("errorStatus"), gin.H{
			"status": "failed",
			"error":  c.GetString("errorMessage"),
		})
		c.Abort()
		return
	}

	exist, err := r.UserUsecase.CheckExistenceByEmail(c, userEmail)
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
			"error":  "the user is no longer existed",
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

	c.SetCookie("token", token, 3600, "/", "localhost", false, true)
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
	})
}
