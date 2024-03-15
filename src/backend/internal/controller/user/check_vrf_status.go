package user

import (
	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) CheckVerificationStatus(c *gin.Context) {
	user := c.MustGet("user")
	userObj, ok := user.(model.User)
	if !ok {
		util.Raise400Error(c, "could not bind JSON")
		return
	}

	if userObj.VerificationStatus != model.PhotographerVerifiedStatus {
		util.Raise403Error(c, "you have not yet been verified")
		return
	}

	c.Next()
}
