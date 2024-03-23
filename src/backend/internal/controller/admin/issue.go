package admin

import (
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
}
