package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) RegCustomer(c *gin.Context) {
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
