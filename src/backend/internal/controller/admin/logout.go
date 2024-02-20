package admin

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

// @Summary      Logout endpoint for administrators
// @Description Logout endpoint for administrators
// @Tags         admin
// @Param Token header string true "Session token is required"
// @Accept       json
// @Produce      json
// @Success      200 {object} model.JSONSuccessResult{status=string,data=nil} "Logged out successfully"
// @Failure 404 {object} model.JSONErrorResult{status=string,error=nil} "Administrator is no longer existed"
// @Failure 500 {object} model.JSONErrorResult{status=string,error=nil} "Unhandled internal server error"
//
// @Router       /admin/v1/logout [put]
func (r *Resolver) Logout(c *gin.Context) {
	admin, exist := c.Get("admin")
	if !exist {
		c.JSON(http.StatusNotFound, gin.H{
			"status": "failed",
			"error":  "the administrator is no longer existed",
		})
		c.Abort()
		return
	}

	adminModel, ok := admin.(model.Administrator)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "please check the model of the administrator",
			"error":   "cannot do type assertion",
		})
		c.Abort()
		return
	}

	adminModel.LoggedOut = true
	if err := r.AdminUsecase.AdminRepo.UpdateOne(c, &adminModel); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "you have logged out successfully",
	})
}
