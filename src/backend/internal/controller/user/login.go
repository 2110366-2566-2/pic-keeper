package user

import (
	"fmt"
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/user/fieldvalidate"
	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/third-party/auth"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// @Summary      User login via email and password
// @Description  User login
// @Tags         authen
// @Param Credentials body model.LoginCredentials true "email and password of the user"
// @Accept       json
// @Produce      json
// @Success      200 {object} model.JSONSuccessResult{status=string,data=nil} "The token and user data will be returned inside the data field"
// @Failure 400 {object} model.JSONErrorResult{status=string,error=nil} "Incorrect input"
// @Failure 404 {object} model.JSONErrorResult{status=string,error=nil} "User does not exist"
// @Failure 500 {object} model.JSONErrorResult{status=string,error=nil} "Unhandled internal server error"
//
// @Router       /authen/v1/login [post]
func (r *Resolver) Login(c *gin.Context) {
	cred := model.LoginCredentials{}
	if err := c.BindJSON(&cred); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"error":   err.Error(),
			"message": "unable to bind request body with json, please recheck",
		})
		c.Abort()
		return
	}

	if fieldErr := fieldvalidate.LoginUser(cred); len(fieldErr) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "failed",
			"errors": util.JSONErrs(fieldErr),
		})
		c.Abort()
		return
	}

	existedUser, err := r.UserUsecase.FindOneByEmail(c, cred.Email)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	if existedUser.Provider == nil {
		if err := bcrypt.CompareHashAndPassword([]byte(*existedUser.Password), []byte(cred.Password)); err != nil {
			c.JSON(http.StatusConflict, gin.H{
				"status":  "failed",
				"error":   err.Error(),
				"message": "incorrect password",
			})
			c.Abort()
			return
		}
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status": "failed",
			"error":  fmt.Sprintf("Use %s OAuth2 instead", *existedUser.Provider),
		})
		c.Abort()
		return
	}

	secretKey, exist := c.Get("secretKey")
	if !exist {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  "secret key not found",
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

	existedUser.LoggedOut = false
	if err := r.UserUsecase.UserRepo.UpdateOne(c, existedUser); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	token, err := jwtWrapper.GenerateToken(c, cred.Email, false)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status":              "success",
		"session_token":       token,
		"data":                existedUser,
		"profile_picture_url": GetProfilePictureUrl(existedUser.ProfilePictureKey),
	})

}
