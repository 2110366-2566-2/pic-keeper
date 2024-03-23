package admin

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
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
