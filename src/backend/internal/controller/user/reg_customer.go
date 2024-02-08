package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/user/fieldvalidate"
	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) RegCustomer(c *gin.Context) {
	newUser := model.UserInput{}
	if err := c.BindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"error":   err.Error(),
			"message": "unable to bind request body with json, please recheck",
		})
		c.Abort()
		return
	}

	// field validate
	if fieldErr := fieldvalidate.RegCustomer(newUser); len(fieldErr) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "failed",
			"errors": util.JSONErrs(fieldErr),
		})
		c.Abort()
		return
	}

	// change type
	userModel := model.User{
		Id:        uuid.New(),
		Name:      newUser.Name,
		Email:     newUser.Email,
		Password:  newUser.Password,
		LoggedOut: false,
	}

	// add to database
	if err := r.UserUsecase.UserRepo.AddOne(c, &userModel); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status": "success",
		"data":   userModel,
	})
}
