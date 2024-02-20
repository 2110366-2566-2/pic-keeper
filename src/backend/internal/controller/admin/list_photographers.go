package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// @Summary      List all unverified photographers
// @Description List all unverified photographers
// @Tags         admin
// @Param Token header string true "Session token is required"
// @Accept       json
// @Produce      json
// @Success      200 {object} model.JSONSuccessResult{status=string,data=nil} "List of unverified photographers will be located inside the data field"
// @Failure 404 {object} model.JSONErrorResult{status=string,error=nil} "Administrator is no longer existed"
// @Failure 500 {object} model.JSONErrorResult{status=string,error=nil} "Unhandled internal server error OR session token cannot be verified"
//
// @Router       /admin/v1/verifications/unverified-photographers [get]
func (r *Resolver) ListUnverifiedPhotographers(c *gin.Context) {
	unvrfPhotographers, err := r.PhotographerUsecase.ListUnverifiedPhotographers(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error,
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   unvrfPhotographers,
	})
}
