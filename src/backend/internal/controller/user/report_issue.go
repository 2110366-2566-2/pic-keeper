package user

import (
	"net/http"
	"time"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) ReportIssue(c *gin.Context) {
	user, ok := GetUser(c)
	if !ok {
		return
	}

	issueInput := model.IssueInput{}
	if err := c.BindJSON(&issueInput); err != nil {
		util.Raise500Error(c, err)
		return
	}

	// fieldvalidate, extract later if other fileds are added to `issue`
	if issueInput.Description == nil || *issueInput.Description == "" {
		util.Raise400Error(c, "the issue's description must be specified")
		return
	}

	issue := &model.Issue{
		Id:          uuid.New(),
		Description: *issueInput.Description,
		ReporterId:  user.Id,
		Status:      model.IssueOpenStatus,
		Subject:     model.IssueTechnicalSubject,
		CreatedAt:   time.Now(),
		DueDate:     time.Now().Add(3 * 24 * time.Hour),
	}

	if err := r.IssueUsecase.IssueRepo.AddOne(c, issue); err != nil {
		util.Raise500Error(c, err)
		return
	}

	issue.Reporter = *user

	c.JSON(http.StatusCreated, gin.H{
		"status": "success",
		"data":   issue,
	})
}
