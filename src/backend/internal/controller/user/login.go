package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/user/fieldvalidate"
	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/third-party/auth"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) Login(c *gin.Context) {
	cred := model.LoginCredentials{}
	if err := c.BindJSON(&cred); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   err.Error(),
			"message": "unable to bind request body with json, please recheck",
		})
		return
	}

	if fieldErr := fieldvalidate.LoginUser(cred); len(fieldErr) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": util.JSONErrs(fieldErr),
		})
		return
	}

	existedUser, err := r.UserUsecase.UserRepo.FindOneByEmail(c, cred.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	if *existedUser.Password != cred.Password {
		c.JSON(http.StatusConflict, gin.H{
			"error": "incorrect password",
		})
		return
	}

	jwtWrapper := auth.JwtWrapper{
		SecretKey:         cred.Password,
		Issuer:            "administrator",
		ExpirationMinutes: 5,
		ExpirationHours:   12,
	}

	token, err := jwtWrapper.GenerateToken(cred.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"session-token": token,
	})

}
