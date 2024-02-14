package photographer

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/user/fieldvalidate"
	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) RegPhotographer(c *gin.Context) {
	newPhotographer := model.UserInput{}
	if err := c.BindJSON(&newPhotographer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"error":   err.Error(),
			"message": "unable to bind request body with json, please recheck",
		})
		c.Abort()
		return
	}

	/* add to user table*/
	if fieldErr := fieldvalidate.Register(newPhotographer); len(fieldErr) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "failed",
			"errors": util.JSONErrs(fieldErr),
		})
		c.Abort()
		return
	}

	userModel := model.User{
		Id:        uuid.New(),
		Name:      newPhotographer.Name,
		Email:     newPhotographer.Email,
		Password:  newPhotographer.Password,
		LoggedOut: false,
	}

	if err := r.UserUsecase.UserRepo.AddOne(c, &userModel); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	photographerModel := model.Photographer{
		Id:         uuid.New(),
		UserId:     userModel.Id,
		IsVerified: false,
	}

	if err := r.PhotographerUsecase.PhotographerRepo.AddOne(c, &photographerModel); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status": "success",
		"data":   photographerModel,
	})
}
