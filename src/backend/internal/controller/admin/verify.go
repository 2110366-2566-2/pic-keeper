package admin

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// @Summary      Verify the specified photographer
// @Description Verify the specified photographer
// @Tags         admin
// @Param Token header string true "Session token is required"
// @Param photographerId path string true "The ID of the to-be-verified photographer"
// @Accept       json
// @Produce      json
// @Success      200 {object} model.JSONSuccessResult{status=string,data=nil} "Successfully verified the photographer"
// @Failure 500 {object} model.JSONErrorResult{status=string,error=nil} "Unhandled internal server error OR session token cannot be verified"
// @Failure 500 {object} model.JSONErrorResult{status=string,error=nil} "Issues with finding the photographer in the database"
// @Router       /admin/v1/verifications/verify/:id [get]
func (r *Resolver) Verify(c *gin.Context) {
	photographerId := c.Param("id")

	toBeVrf, err := r.PhotographerUsecase.PhotographerRepo.FindOneById(c, uuid.MustParse(photographerId))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error,
		})
		c.Abort()
		return
	}

	toBeVrf.VerificationStatus = model.PhotographerVerifiedStatus
	if err = r.PhotographerUsecase.PhotographerRepo.UpdateOne(c, toBeVrf); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error,
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   toBeVrf,
	})
}
