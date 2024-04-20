package admin

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// @Summary      Close the specified issue
// @Description  Close the specified issue by setting its status to closed
// @Tags         admin
// @Param Token header string true "Session token is required"
// @Param issueId path string true "The ID of the issue to be closed"
// @Accept       json
// @Produce      json
// @Success      200 {object} model.JSONSuccessResult{status=string,data=nil} "Successfully closed the issue"
// @Failure      500 {object} model.JSONErrorResult{status=string,error=nil} "Unhandled internal server error OR session token cannot be verified"
// @Failure      500 {object} model.JSONErrorResult{status=string,error=nil} "Issues with finding the issue in the database"
// @Router       /admin/v1/issues/close/:id [patch]
func (r *Resolver) CloseIssue(c *gin.Context) {
	adminObj, ok := getAdmin(c)
	if !ok {
		return
	}

	if ok := checkIsAdmin(adminObj, c); !ok {
		return
	}

	issueId := c.Param("id")

	issue, err := r.IssueUsecase.IssueRepo.FindOneById(c, uuid.MustParse(issueId))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	issue.Status = model.IssueClosedStatus // Make sure you have a constant defined for the closed status
	if err = r.IssueUsecase.IssueRepo.UpdateOne(c, issue); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   nil, // Or return the updated issue if preferred
	})
}
