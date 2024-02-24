package user

import (
	"net/http"
	"net/url"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/third-party/auth"
	"github.com/Roongkun/software-eng-ii/internal/third-party/oauth2"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// @Summary      This will be automatically called when the Google OAuth2 login process is completed
// @Description  This will be automatically called when the Google OAuth2 login process is completed
// @Tags         google
// @Accept       json
// @Produce      json
// @Success      200 {object} model.JSONSuccessResult{status=string,data=nil} "The session token will be returned in the data field"
// @Failure 500 {object} model.JSONErrorResult{status=string,error=nil} "Unhandled internal server error"
//
// @Router       /authen/v1/google/callback [get]
func (r *Resolver) GoogleCallback(c *gin.Context) {
	provider := "Google"
	config := util.GetGoogleLibConfig(c)
	code := c.Query("code")

	if code == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "failed",
			"message": "Authorization code not provided",
		})
		c.Abort()
		return
	}

	tokenRes, err := oauth2.GetGoogleOAuth2Token(config, code)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"status":  "failed",
			"message": err.Error(),
		})
		c.Abort()
		return
	}

	googleUser, err := oauth2.GetGoogleUser(tokenRes.AccessToken, tokenRes.IdToken)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"status":  "failed",
			"message": err.Error(),
		})
		c.Abort()
		return
	}

	exist, err := r.UserUsecase.CheckExistenceByEmail(c, googleUser.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "failed",
			"message": err.Error(),
		})
		c.Abort()
		return
	}

	var user *model.User
	if !exist {
		newUser := model.User{
			Id:        uuid.New(),
			Name:      googleUser.Name,
			Email:     googleUser.Email,
			Provider:  &provider,
			Password:  nil,
			LoggedOut: false,
		}

		if err := r.UserUsecase.UserRepo.AddOne(c, &newUser); err != nil {
			c.JSON(http.StatusBadGateway, gin.H{
				"status":  "failed",
				"message": err.Error(),
			})
			c.Abort()
			return
		}
		user = &newUser
	} else {
		var innerErr error
		user, innerErr = r.UserUsecase.UserRepo.FindOneByEmail(c, googleUser.Email)
		if innerErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"status":  "failed",
				"message": err.Error(),
			})
			c.Abort()
			return
		}
		user.LoggedOut = false
		if err := r.UserUsecase.UserRepo.UpdateOne(c, user); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"status":  "failed",
				"message": err.Error(),
			})
			c.Abort()
			return
		}
	}

	secretKey, exist := c.Get("secretKey")
	if !exist {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "failed",
			"message": "secret key not found",
		})
		c.Abort()
		return
	}

	jwtWrapper := auth.JwtWrapper{
		SecretKey:         secretKey.(string),
		Issuer:            "AuthProvider",
		ExpirationMinutes: 5,
		ExpirationHours:   12,
	}

	token, err := jwtWrapper.GenerateToken(c, googleUser.Email, false)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"message": err.Error(),
		})

		c.Abort()
		return
	}

	// c.JSON(http.StatusOK, gin.H{
	// 	"status":        "success",
	// 	"session_token": token,
	// })

	c.SetCookie("session_token", token, 3600, "/", "localhost", false, true)
	location := url.URL{Path: "http://localhost:3000/auth/handle-login"}
	c.Redirect(http.StatusFound, location.RequestURI())
}
