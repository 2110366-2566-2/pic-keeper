package admin

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) GetIssuesWithOption(c *gin.Context) {
	admin, ok := getAdmin(c)
	if !ok {
		return
	}
	if ok := checkIsAdmin(admin, c); !ok {
		return
	}

	issueFilter := model.IssueFilter{}
	if err := c.BindQuery(&issueFilter); err != nil {
		util.Raise500Error(c, err)
		return
	}

	issues, err := r.IssueUsecase.FindIssuesWithFilter(c, issueFilter)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	userIdsToIssue := map[uuid.UUID][]*model.Issue{}
	userIds := []uuid.UUID{}
	for _, issue := range issues {
		if _, exist := userIdsToIssue[issue.ReporterId]; !exist {
			userIdsToIssue[issue.ReporterId] = append(userIdsToIssue[issue.ReporterId], issue)
			userIds = append(userIds, issue.ReporterId)
		}
	}

	users, err := r.UserUsecase.UserRepo.FindByIds(c, userIds...)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}
	for _, user := range users {
		for _, issue := range userIdsToIssue[user.Id] {
			issue.Reporter = *user
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   issues,
	})
}

func (r *Resolver) GetIssueHeaderMetadata(c *gin.Context) {
	admin, ok := getAdmin(c)
	if !ok {
		return
	}
	if ok := checkIsAdmin(admin, c); !ok {
		return
	}

	issueHeaderMetadata, err := r.IssueUsecase.GetIssueHeaderMetadata(c)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   issueHeaderMetadata,
	})
}
