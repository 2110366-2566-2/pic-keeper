package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// @Summary      Register for photographers
// @Description  Register for photographers
// @Param CustomerData body model.UserInput true "The photographer's data"
// @Tags authen
// @Accept       json
// @Produce      json
// @Success      200 {object} model.JSONSuccessResult{status=string,data=nil} "Successfully registered"
// @Failure 400 {object} model.JSONErrorResult{status=string,error=nil} "Incorrect input"
// @Failure 500 {object} model.JSONErrorResult{status=string,error=nil} "Unhandled internal server error"
// @Router /authen/v1/register/photographer [post]
func (r *Resolver) RegPhotographer(c *gin.Context) {
	userModel, errs := util.UserConstructor(c)
	if len(errs) > 0 {
		c.JSON(c.GetInt("errorStatus"), gin.H{
			"status": "failed",
			"error":  util.JSONErrs(errs),
		})
		c.Abort()
		return
	}

	// TODO: add atomic process
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
