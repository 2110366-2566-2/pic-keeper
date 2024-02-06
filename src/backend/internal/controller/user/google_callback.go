package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/third-party/auth"
	"github.com/Roongkun/software-eng-ii/internal/third-party/oauth2"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) GoogleCallback(c *gin.Context) {
	config := util.GetGoogleLibConfig(c)
	code := c.Query("code")

	if code == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "fail",
			"message": "Authorization code not provided",
		})
	}

	tokenRes, err := oauth2.GetGoogleOAuth2Token(config, code)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"status":  "fail",
			"message": err.Error(),
		})
		c.Abort()
		return
	}

	googleUser, err := oauth2.GetGoogleUser(tokenRes.AccessToken, tokenRes.IdToken)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"status":  "fail",
			"message": err.Error(),
		})
		c.Abort()
		return
	}

	exist, err := r.UserUsecase.CheckExistenceByEmail(c, googleUser.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "fail",
			"message": err.Error(),
		})
		c.Abort()
		return
	}

	if !exist {
		newUser := model.User{
			Id:        uuid.New(),
			Name:      googleUser.Name,
			Email:     googleUser.Email,
			Password:  nil,
			LoggedOut: false,
		}

		if err := r.UserUsecase.UserRepo.AddOne(c, &newUser); err != nil {
			c.JSON(http.StatusBadGateway, gin.H{
				"status":  "fail",
				"message": err.Error(),
			})
			c.Abort()
			return
		}
	}

	secretKey, exist := c.Get("secretKey")
	if !exist {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "secret key not found",
		})
	}

	jwtWrapper := auth.JwtWrapper{
		SecretKey: secretKey.(string),
		Issuer:    "AuthProvider",
	}

	token, err := jwtWrapper.GenerateToken(googleUser.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "fail",
			"message": err.Error(),
		})

		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":        "success",
		"session-token": token,
	})

}
