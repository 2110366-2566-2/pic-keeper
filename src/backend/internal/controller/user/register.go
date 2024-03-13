package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/gin-gonic/gin"
)

// @Summary      Register for customers
// @Description  Register for customers
// @Param CustomerData body model.UserInput true "The customer's data"
// @Tags authen
// @Accept       json
// @Produce      json
// @Success      200 {object} model.JSONSuccessResult{status=string,data=nil} "Successfully registered"
// @Failure 400 {object} model.JSONErrorResult{status=string,error=nil} "Incorrect input"
// @Failure 500 {object} model.JSONErrorResult{status=string,error=nil} "Unhandled internal server error"
// @Router /authen/v1/register/customer [post]
func (r *Resolver) Register(c *gin.Context) {
	userModel, errs := util.UserConstructor(c)
	if len(errs) > 0 {
		c.JSON(c.GetInt("errorStatus"), gin.H{
			"status": "failed",
			"error":  util.JSONErrs(errs),
		})
		c.Abort()
		return
	}

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
