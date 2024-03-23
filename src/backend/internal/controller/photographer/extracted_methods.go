package photographer

import (
	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) getPhotographer(c *gin.Context) (*model.User, bool) {
	photographer := c.MustGet("user")
	phtgObj, ok := photographer.(model.User)
	if !ok {
		util.Raise400Error(c, "invalid user type in context")
		return nil, false
	}

	return &phtgObj, true
}
